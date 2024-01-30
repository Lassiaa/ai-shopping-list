import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

import Header from "../components/Header";
import CreateGroup from "../components/CreateGroup";
import GroupList from "../components/GroupList";

import style from "../assets/style";

const Groups = () => {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshGroupList, setRefreshGroupList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
      setUser(user);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    return null;
  }

  const toggleButton = () => {
    setCreateGroupOpen(!createGroupOpen);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className={style.body}>
      <Header onToggleButton={toggleButton} />

      {createGroupOpen ? (
        <CreateGroup
          onToggleButton={toggleButton}
          onAddGroup={() => setRefreshGroupList((prev) => !prev)}
        />
      ) : (
        <></>
      )}

      <GroupList refresh={refreshGroupList} />

      <div className={style.signOutButtonSectionGroup}>
        <button className={style.signOutButton} onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Groups;
