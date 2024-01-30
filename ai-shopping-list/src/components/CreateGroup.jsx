import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../utils/firebase";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";

import style from "../assets/style";

const CreateGroup = ({ onToggleButton, onAddGroup }) => {
  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [participants, setParticipants] = useState([""]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);

        try {
          const userDoc = firestore.collection("users").doc(uid);
          userDoc.get().then((doc) => {
            if (doc.exists) {
              const userData = doc.data();
              setUsername(userData.username);
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreateGroup = async () => {
    const sanitizedParticipants = participants.filter(
      (participant) => participant.trim() !== ""
    );

    try {
      const group = {
        groupName,
        participants: [username, ...sanitizedParticipants],
      };

      const list = {
        listName: "Shopping list",
        items: ["My first item"],
      };

      const userDocRef = firestore.collection("users").doc(user);
      const userDoc = await userDocRef.get();
      const userData = userDoc.data();

      const groupRef = await userDocRef.collection("groups").add(group);
      const groupDocRef = await userDocRef
        .collection("groups")
        .doc(groupRef.id);

      const groupDoc = await groupDocRef.get();
      const groupData = groupDoc.data();

      const updatedGroups = [
        ...(userData.groups || []),
        {
          groupId: groupRef.id,
          groupName: group.groupName,
        },
      ];

      await userDocRef.update({ groups: updatedGroups });

      const listsRef = await groupDocRef.collection("lists").add(list);
      const updatedLists = [
        ...(groupData.lists || []),
        {
          listId: listsRef.id,
          listName: list.listName,
        },
      ];

      await groupDocRef.update({ lists: updatedLists });

      setNotification("Group " + groupName + " created!");

      onAddGroup();

      setGroupName("");
      setParticipants([""]);

      setNotification("");
    } catch (error) {
      console.error("Error adding user to group:", error);
    }
  };

  const handleAddParticipant = () => {
    setParticipants([...participants, ""]);
  };

  const handleRemoveParticipant = (index) => {
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
  };

  const handleClose = () => {
    onToggleButton(); // Close the CreateGroup component
  };

  return (
    <form
      className={style.groupForm}
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateGroup();
      }}
    >
      <h2 className={style.groupHeader}>Create group</h2>
      <input
        className={style.groupInput}
        placeholder="group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        required
      />
      <div className={style.participantSection}>
        <div className={style.participantInputSection}>
          {participants.map((participant, index) => (
            <div key={index} className={style.participantContainer}>
              <button
                className={style.removeParticipantButton}
                type="button"
                onClick={() => handleRemoveParticipant(index)}
              >
                <DeleteIcon />
              </button>

              <input
                className={style.participantInput}
                placeholder={`participant ${index + 1}`}
                value={participant}
                onChange={(e) => {
                  const newParticipants = [...participants];
                  newParticipants[index] = e.target.value;
                  setParticipants(newParticipants);
                }}
                required
              />
            </div>
          ))}
        </div>

        <button
          className={style.addParticipantButton}
          type="button"
          onClick={handleAddParticipant}
        >
          <ControlPointIcon />
        </button>
      </div>

      <div className={style.groupButtonContainer}>
        <button
          className={style.groupButton}
          type="submit"
          onClick={() => handleClose()}
        >
          Create group
        </button>
      </div>

      <p className={style.notification}>{notification}</p>
    </form>
  );
};

CreateGroup.propTypes = {
  onToggleButton: PropTypes.func.isRequired,
  onAddGroup: PropTypes.func.isRequired,
};

export default CreateGroup;
