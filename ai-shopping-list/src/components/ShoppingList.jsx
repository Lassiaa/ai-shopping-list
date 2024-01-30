import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { auth, firestore } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

import style from "../assets/style";

import DeleteIcon from "@mui/icons-material/Delete";

const ShoppingList = ({ refresh }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [listEmpty, setListEmpty] = useState(true);

  const [currentGroup, setCurrentGroup] = useState("");
  const [currentList, setCurrentList] = useState("");

  const [participants, setParticipants] = useState([]);

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

  useEffect(() => {
    const fetchGroupsAndLists = async () => {
      try {
        if (loggedUser && currentGroup) {
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
                const groupParticipants = groupData.participants || [];

                setParticipants(groupParticipants);

                const lists = groupData.lists || [];
                const selectedListData = lists.find(
                  (list) => list.listName === currentList
                );

                if (selectedListData) {
                  const listId = selectedListData.listId;

                  const listDocRef = groupDocRef
                    .collection("lists")
                    .doc(listId);

                  const listDoc = await listDocRef.get();

                  if (listDoc.exists) {
                    const listData = listDoc.data();
                    const listItems = listData.items || [];

                    setListEmpty(listItems.length === 0);

                    setItems(listItems);
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
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchGroupsAndLists();
  }, [loggedUser, currentGroup, refresh]);

  const addItem = async (event) => {
    event.preventDefault();

    try {
      if (!inputValue.trim()) {
        console.error("Item name cannot be empty");
        return;
      }

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

                if (listItems.includes(inputValue)) {
                  console.warn("Item already in list");
                  return;
                }

                const updatedItems = [...listItems, inputValue];

                await listDocRef.update({ items: updatedItems });

                setItems(updatedItems);
                setInputValue("");
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
  };

  const removeItem = async (index) => {
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

                const updatedItems = listItems.filter(
                  (item, itemIndex) => itemIndex !== index
                );

                await listDocRef.update({ items: updatedItems });

                setItems(updatedItems);

                if (updatedItems.length === 0) {
                  setListEmpty(true);
                } else {
                  setListEmpty(false);
                }
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
  };

  return (
    <>
      <div className={style.productSection}>
        <div className={style.productGroupSection}>
          <h2 className={style.listHeaderGroup}>{currentGroup}</h2>
          <p className={style.listHeaderParticipants}>
            {participants.join(", ")}
          </p>
        </div>

        <h3 className={style.listHeaderList}>{currentList}</h3>

        <form className={style.productForm} onSubmit={addItem}>
          <input
            className={style.productInput}
            placeholder="Add products"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className={style.productAddButton} type="submit">
            Add
          </button>
        </form>
      </div>

      {loading ? (
        <div className={style.list}>
          <p className={style.listEmpty}>Loading...</p>
        </div>
      ) : (
        <>
          {listEmpty ? (
            <div className={style.list}>
              <p className={style.listEmpty}>List is empty</p>
            </div>
          ) : (
            <div className={style.list}>
              <ul>
                {items.map((item, index) => (
                  <div className={style.itemSection} key={index}>
                    <li className={style.item}>
                      <input type="checkbox"></input>
                      <p className={style.itemName}>{item}</p>
                    </li>
                    <button
                      className={style.itemRemove}
                      onClick={() => removeItem(index)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </>
  );
};

ShoppingList.propTypes = {
  refresh: PropTypes.bool.isRequired,
};

export default ShoppingList;
