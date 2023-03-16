import React, { useState, useEffect } from "react";

const useTime = () => {
  const [meal, setMeal] = useState({ text: "", type: "", day: 0 });

  const mealChange = (event) => {
    setMeal(event);
    console.log(meal);
  };

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const date = new Date(position.timestamp);
        const time = date.getHours();
        const currDay = date.getDay();

        if (time >= 3 && time < 11) {
          mealChange({
            text: "Breakfast Recipes",
            type: "breakfast",
            day: currDay,
          });
        } else if (time >= 11 && time < 15) {
          mealChange({
            text: "Lunch Recipes",
            type: "appetizer",
            day: currDay,
          });
        } else {
          mealChange({
            text: "Dinner Recipes",
            type: "main course",
            day: currDay,
          });
        }
      },
      (err) => console.log(err)
    );
  }, []);

  return meal;
};

export default useTime;
