import axios from "axios";
import { collection, addDoc, getDocs, getDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Alert } from "@mui/material";

import type { ShortMocktailInfo, LongMocktailInfo } from "../types/Mocktails";

const getAllUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
const getByIdUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

async function getAllMocktails(): Promise<ShortMocktailInfo[] | null> {
  try {
    const response = await axios.get(getAllUrl);
    return response.data.drinks;
  } catch (error) {
    console.error("getAllMocktails error: ", error);
    return null;
  }
}

async function getMocktailById(idDrink: string): Promise<LongMocktailInfo | null> {
  try {
    const response = await axios.get(`${getByIdUrl}${idDrink}`);
    return response.data.drinks[0] || null;
  } catch (error) {
    console.error("getMocktailById error: ", error);
    return null;
  }
}

async function getCabinetMocktails(): Promise<ShortMocktailInfo[] | null> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userMocktailCollection = collection(db, "users", user.uid, "mocktails");
    const snapshot = await getDocs(userMocktailCollection);

    const mocktails = snapshot.docs.map((doc) => ({
      ...(doc.data() as ShortMocktailInfo),
      docId: doc.id,
    }));

    return mocktails;
  } catch (error) {
    console.error("getCabinetMocktails error: ", error);
    return null;
  }
}

async function getMocktailFromCabinet(docId: string): Promise<ShortMocktailInfo | null> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const docRef = doc(db, "users", user.uid, "mocktails", docId);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) return null;

    return {
      ...(snapshot.data() as ShortMocktailInfo),
      docId: snapshot.id,
    };
  } catch (error) {
    console.error("getMocktailFromCabinet error:", error);
    return null;
  }
}

async function addMocktailToCabinet(mocktail: ShortMocktailInfo, setAlertMessage: (message: string) => void) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const userMocktailCollection = collection(db, "users", user.uid, "mocktails");

    const q = query(userMocktailCollection, where("idDrink", "==", mocktail.idDrink));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      setAlertMessage("This mocktail is already added to your cabinet!");
      return;
    }

    await addDoc(userMocktailCollection, mocktail);
  } catch (error) {
    console.error("addMocktailToCabinet error: ", error);
  }
}

async function removeMocktailFromCabinet(docId: string) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const docRef = doc(db, "users", user.uid, "mocktails", docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("removeMocktailFromCabinet error: ", error);
  }
}

export {
  getAllMocktails,
  getMocktailById,
  getCabinetMocktails,
  getMocktailFromCabinet,
  addMocktailToCabinet,
  removeMocktailFromCabinet,
};
