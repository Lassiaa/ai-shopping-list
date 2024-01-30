import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../utils/firebase";

import ControlPointIcon from "@mui/icons-material/ControlPoint";

import CreateList from "../components/CreateList";

import style from "../assets/style";

const GroupList = ({ refresh }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [lists, setLists] = useState([]);
  const [creatingList, setCreatingList] = useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const handleListClick = (groupName, listName) => {
    localStorage.setItem(
      "currentGroupList",
      JSON.stringify({ groupName, listName })
    );
  };

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setLoggedUser(user);

          const userDocRef = firestore.collection("users").doc(user.uid);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            const userGroups = userData.groups || [];

            setGroups(userGroups.map((group) => group.groupName));
            setGroupsLoaded(true);

            const initialGroup =
              userGroups.length > 0 ? userGroups[0].groupName : null;
            setSelectedGroup(initialGroup);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    return () => unsubscribe();
  }, [refresh]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        if (selectedGroup) {
          const userDocRef = firestore.collection("users").doc(loggedUser.uid);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            const userGroups = userData.groups || [];

            const selectedGroupData = userGroups.find(
              (group) => group.groupName === selectedGroup
            );

            if (selectedGroupData) {
              const groupId = selectedGroupData.groupId;
              setSelectedGroupId(groupId);

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

                const listsRef = groupDocRef.collection("lists");
                const listSnapshot = await listsRef.get();

                if (!listSnapshot.empty) {
                  const groupLists = listSnapshot.docs.map(
                    (doc) => doc.data().listName
                  );
                  setLists(groupLists);
                } else {
                  console.error("No documents found in the 'lists' collection");
                }
              } else {
                console.error("Group document does not exist");
              }
            } else {
              console.error("Selected group not found in user data");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching group participants:", error);
      }
    };

    fetchParticipants();
  }, [selectedGroup, loggedUser, refresh]);

  const handleListCreated = () => {
    setCreatingList(false);
  };

  const listGroups = groups.map((item, index) => (
    <li className={style.groupListItem} key={index}>
      <button
        className={style.groupListButton}
        onClick={() => setSelectedGroup(item)}
      >
        <h3 className={style.groupSection}>{item}</h3>
        <p className={style.participantsSection}>
          {selectedGroup === item ? participants.join(", ") : ""}
        </p>
        {selectedGroup === item ? (
          <>
            {lists.map((listItem, listIndex) => (
              <button
                key={listIndex}
                className={style.listSection}
                onClick={() => {
                  handleListClick(item, listItem), navigate("/");
                }}
              >
                {listItem}
              </button>
            ))}
            <button
              className={style.addListSection}
              onClick={() => setCreatingList(true)}
            >
              <ControlPointIcon /> New List
            </button>
            {creatingList && (
              <CreateList
                groupId={selectedGroupId}
                onListCreated={handleListCreated}
              />
            )}
          </>
        ) : (
          <></>
        )}
      </button>
    </li>
  ));

  return (
    <>
      {groupsLoaded && (
        <div className={style.groupListSection}>
          <h2 className={style.listHeader}>My groups</h2>
          <ul className={style.GroupList}>{listGroups}</ul>
        </div>
      )}
    </>
  );
};

GroupList.propTypes = {
  refresh: PropTypes.bool,
};

export default GroupList;
