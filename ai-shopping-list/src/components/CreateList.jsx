import { useState, useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../utils/firebase";

import style from "../assets/style";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import PropTypes from "prop-types";

const CreateList = ({ groupId, onListCreated }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [newListName, setNewListName] = useState("");

  // console.log("User: " + loggedUser);
  // console.log("Group: " + groupId);

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

  const handleCreateList = async () => {
    try {
      if (!newListName.trim()) {
        console.error("List name cannot be empty");
        return;
      }

      const listsRef = firestore
        .collection("users")
        .doc(loggedUser.uid)
        .collection("groups")
        .doc(groupId)
        .collection("lists");

      const newList = {
        listName: newListName,
        items: ["My first item"],
      };

      const addListRef = await listsRef.add(newList);

      const userDocRef = firestore.collection("users").doc(loggedUser.uid);
      const userDoc = await userDocRef.get();
      const userData = userDoc.data();

      const lists = userData.groups.lists || [];

      lists.push({
        listId: addListRef.id,
        listName: newListName,
      });

      const groupDocRef = await userDocRef.collection("groups").doc(groupId);
      const groupDoc = await groupDocRef.get();
      const groupData = groupDoc.data();

      const updatedLists = [
        ...(groupData.lists || []),
        {
          listId: addListRef.id,
          listName: newListName,
        },
      ];

      await groupDocRef.update({ lists: updatedLists });

      onListCreated(newList);
      setNewListName("");
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  return (
    <div className={style.createListSection}>
      <input
        className={style.createListInput}
        type="text"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        placeholder="Enter list name"
      />
      <button className={style.createListButton} onClick={handleCreateList}>
        <CheckCircleOutlineIcon />
      </button>
    </div>
  );
};

CreateList.propTypes = {
  groupId: PropTypes.string.isRequired,
  onListCreated: PropTypes.func.isRequired,
};

export default CreateList;
