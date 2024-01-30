import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";

import Header from "../components/Header";
import AiGenerator from "../components/AiGenerator";
import ShoppingList from "../components/ShoppingList";

import style from "../assets/style";

const Main = () => {
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [refreshShoppingList, setRefreshShoppingList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const toggleButton = () => {
    setGeneratorOpen(!generatorOpen);
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

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className={style.body}>
      <Header onToggleButton={toggleButton} />

      {generatorOpen ? (
        <AiGenerator
          onToggleButton={toggleButton}
          onAddItem={() => setRefreshShoppingList((prev) => !prev)}
        />
      ) : (
        <></>
      )}

      <ShoppingList refresh={refreshShoppingList} />

      <div className={style.signOutButtonSection}>
        <button
          className={style.myGroupsButton}
          onClick={() => goTo("/groups")}
        >
          My groups
        </button>
        <button className={style.signOutButton} onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  );
};

export default Main;
