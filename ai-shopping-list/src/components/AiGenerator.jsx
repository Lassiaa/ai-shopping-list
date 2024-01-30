import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeApiRequest, roles } from "../utils/openai";

import { auth, firestore } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

import style from "../assets/style";

const AiGenerator = ({ onToggleButton, onAddItem }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [currentGroup, setCurrentGroup] = useState("");
  const [currentList, setCurrentList] = useState("");

  const [prompt, setPrompt] = useState("");
  const [requestTime, setRequestTime] = useState("");
  const [roleContent, setRoleContent] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [formToggle, setFormToggle] = useState(true);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setLoggedUser(user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        if (loggedUser) {
          const currentGroupListString =
            localStorage.getItem("currentGroupList");

          if (currentGroupListString) {
            const currentGroupList = JSON.parse(currentGroupListString);

            const { groupName, listName } = currentGroupList;

            setCurrentGroup(groupName);
            setCurrentList(listName);

            console.log("groupName:", groupName);
            console.log("listName:", listName);
          } else {
            console.warn("currentGroupList not found in localStorage");
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchCurrentLocation();
  }, [loggedUser]);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleApiRequest = async () => {
    const startTime = performance.now();

    const apiResponse = await makeApiRequest(prompt, roleContent);
    setFormToggle(false);

    localStorage.setItem("userPrompt", prompt);
    localStorage.setItem("apiResponse", apiResponse);

    // const sureText = apiResponse.split(":")[0].trim();

    const itemsArray = apiResponse
      .split("-")
      .slice(1)
      .map((item) => item.trim());

    // console.log("Sure Text:", sureText.trim());
    // console.log("Items Array:", itemsArray);

    setNotification("Ingredients added to shopping list");

    try {
      const userDocRef = firestore.collection("users").doc(loggedUser.uid);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const userGroups = userData.groups || [];
        const selectedGroupData = userGroups.find(
          (group) => group.groupName === currentGroup
        );

        if (selectedGroupData) {
          const groupId = selectedGroupData.groupId;

          const groupDocRef = firestore
            .collection("users")
            .doc(loggedUser.uid)
            .collection("groups")
            .doc(groupId);

          const groupDoc = await groupDocRef.get();

          if (groupDoc.exists) {
            const groupData = groupDoc.data();
            const lists = groupData.lists || [];
            const selectedListData = lists.find(
              (list) => list.listName === currentList
            );

            if (selectedListData) {
              const listId = selectedListData.listId;

              const listDocRef = groupDocRef.collection("lists").doc(listId);

              const listDoc = await listDocRef.get();

              if (listDoc.exists) {
                const listData = listDoc.data();
                const listItems = listData.items || [];

                for (const item of itemsArray) {
                  if (listItems.includes(item)) {
                    console.warn("Item already in list");
                    return;
                  } else {
                    listItems.push(item);
                  }
                }

                await listDocRef.update({ items: listItems });
                onAddItem();
              } else {
                console.error("List document does not exist");
              }
            } else {
              console.error("Selected list not found in group data");
            }
          } else {
            console.error("Group document does not exist");
          }
        } else {
          console.error("Selected group not found in user data");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }

    setTimeout(() => {
      setNotification("");
    }, 3000);

    const endTime = performance.now();
    const elapsedTime = (endTime - startTime) / 1000;

    const formattedTime =
      elapsedTime >= 60
        ? `${Math.floor(elapsedTime / 60)}:${Math.floor(elapsedTime % 60)} min`
        : `${Math.floor(elapsedTime)} sec`;

    setRequestTime(formattedTime);
    setFormToggle(true);

    const existingData = localStorage.getItem("shopping-log.json");

    if (existingData) {
      try {
        const dataArray = JSON.parse(existingData);

        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const lastObject = dataArray[dataArray.length - 1];
          lastObject.requestTime = formattedTime;

          const updatedData = JSON.stringify(dataArray);

          localStorage.setItem("shopping-log.json", updatedData);
        } else {
          console.error("Existing data is not a valid array or is empty.");
        }
      } catch (error) {
        console.error("Error parsing or updating existing data:", error);
      }
    } else {
      console.error("No existing data found in localStorage");
    }

    setRoleContent("");
  };

  const handleGenerate = async () => {
    await setRoleContent(roles.dish);
  };

  useEffect(() => {
    const handleEffect = async () => {
      if (roleContent === roles.dish) {
        await handleApiRequest();
      }
    };

    handleEffect();
  }, [roleContent]);

  useEffect(() => {
    if (formToggle) {
      setRequestStatus(requestTime ? "API Request Time: " + requestTime : "");
    } else {
      setRequestStatus("API request in progress");
    }
  }, [formToggle, requestTime]);

  const handleClose = () => {
    setTimeout(() => {
      onToggleButton();
    }, 3000);
  };

  return (
    <>
      <p className={style.notification}>{notification}</p>

      <div className={style.promptSection}>
        <h2 className={style.promptHeader}>Prompt</h2>
        <textarea
          className={style.promptArea}
          onChange={handlePromptChange}
          value={prompt}
          placeholder="What dish would you like to eat?"
          spellCheck="false"
        ></textarea>

        <button>
          <p
            className={style.buttonGenerate}
            onClick={() => (handleGenerate(), handleClose())}
          >
            Add to list
          </p>
        </button>
      </div>

      <p className={style.requestStatus}>{requestStatus}</p>
    </>
  );
};

AiGenerator.propTypes = {
  onToggleButton: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
};

export default AiGenerator;
