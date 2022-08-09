import React, { useState, useEffect } from "react";

const useTime = () => {
  const [meal, setMeal] = useState({ text: "", type: "" });

  const mealChange = (event) => {
    setMeal(event);
  };

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const date = new Date(position.timestamp);
        const time = date.getHours();

        if (time >= 3 && time < 11) {
          mealChange({
            text: "Breakfast Recipes",
            type: "breakfast, beverage",
          });
        } else if (time >= 11 && time < 15) {
          mealChange({
            text: "Lunch Recipes",
            type: "salad, snack, bread, appetizer, drink, soup, beverage",
          });
        } else {
          mealChange({
            text: "Dinner Recipes",
            type: "main course, side dish, dessert, marinade, appetizer, soup, drink, beverage, sauce",
          });
        } 
      },
      (err) => console.log(err)
    );
  }, []);

  return meal;
};

export default useTime;
