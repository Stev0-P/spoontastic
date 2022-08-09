import React, { useState, useEffect } from "react";

const useTime = () => {
  const [timestamp, setTimestamp] = useState();
  const [meal, setMeal] = useState({ text: "", type: "" });

  const timestampChange = (event) => {
    setTimestamp(event);
  };

  const mealChange = (event) => {
    setMeal(event);
  };

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const date = new Date(position.timestamp);
        const time = date.getHours();
        console.log(time);

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
        } else if (time >= 15 && time < 23) {
          mealChange({
            text: "Dinner Recipes",
            type: "main course, side dish, dessert, marinade, appetizer, soup, drink, beverage, sauce",
          });
        } else {
          mealChange({
            text: "Snacks",
            type: "fingerfood, drink, beverage",
          });
        }
      },
      (err) => console.log(err)
    );
  }, []);

  return meal;
};

export default useTime;
