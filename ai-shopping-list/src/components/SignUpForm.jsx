import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import style from "../assets/style";

const SignUpForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log("Username " + username);
  // console.log("Email " + email);

  // Add user to database
  const addUserToDatabase = async (id, username, email) => {
    try {
      await firestore.collection("users").doc(id).set({
        username: username,
        email: email,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Add user to a default group
  const handleJoinGroup = async (user) => {
    const group = {
      groupName: "My first group",
      participants: [{ participantId: user.uid, participantName: username }],
    };

    const list = {
      listName: "Shopping list",
      items: ["My first item"],
    };

    try {
      const userDocRef = firestore.collection("users").doc(user.uid);
      const userDoc = await userDocRef.get();
      const userData = userDoc.data();

      const groupRef = await userDocRef.collection("groups").add(group);
      const groupDocRef = await userDocRef
        .collection("groups")
        .doc(groupRef.id);

      const listRef = await groupDocRef.collection("lists").add(list);

      const groups = userData.groups || [];
      const lists = userData.lists || [];

      groups.push({
        groupId: groupRef.id,
        groupName: group.groupName,
      });

      lists.push({
        listId: listRef.id,
        listName: list.listName,
      });

      await userDocRef.update({
        userId: user.uid,
        groups: groups,
      });

      await groupDocRef.update({
        lists: lists,
      });
    } catch (error) {
      console.error("Error adding user to group:", error);
    }
  };

  // Submit everything
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;

      addUserToDatabase(uid, username, email);
      await handleJoinGroup(user);

      navigate("/groups");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <>
      <h2 className={style.loginHeader}>Sign up</h2>

      {/* <p className={style.error}>{errorMessage}</p> */}

      <input
        className={style.loginInput}
        value={username}
        type="text"
        placeholder={"username"}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        className={style.loginInput}
        value={email}
        type="email"
        placeholder={"email"}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className={style.loginInput}
        value={password}
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/*       <input
        className={style.loginInput}
        ref={passwordConfRef}
        type="password"
        placeholder="confirm password"
      /> */}

      <div>
        <button className={style.loginButton} onClick={onSubmit} type="submit">
          Sign up
        </button>
      </div>
    </>
  );
};

export default SignUpForm;
