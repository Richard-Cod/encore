import { useState } from "react";
import { Input } from "@/components/ui/input"; // Shadcn Input
import { Button } from "@/components/ui/button"; // Shadcn Button
import { OpeningHours, OpeningHoursState } from "@/logic/interfaces";
import { Label } from "../ui/label";
import {
  open24Hours,
  open24HoursButSunday,
} from "@/app/project/admin/dashboard/settings/UpdateSocietyForm";

// Mapping entre jours de la semaine en anglais et leur affichage en français
export const daysOfWeekInFrench: { [key: string]: string } = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

const UpdateOpeningHours = ({
  openingHours,
  setOpeningHours,
}: {
  openingHours: OpeningHoursState;
  setOpeningHours: any;
}) => {
  // Fonction pour mettre à jour les heures
  const handleOpen24 = () => {
    setOpeningHours();
  };
  const handleChange = (
    day: keyof OpeningHoursState,
    field: keyof OpeningHours,
    value: string
  ) => {
    console.log("day ", day);
    console.log("field ", field);
    console.log("value ", value);
    console.log("openingHours ", openingHours);

    setOpeningHours((prevState: any) => ({
      ...prevState,
      [day]: { ...prevState[day], [field]: value },
    }));
  };

  // Fonction pour envoyer la requête PATCH
  const handleUpdate = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/companies/1/update_opening_hours/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ opening_hours: openingHours }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Heures d'ouverture mises à jour:", data);
      } else {
        console.error("Erreur:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    }
  };

  return (
    <div className="">
      {/* <h1 className="text-sm font-bold mb-4">
        Mettre à jour les heures d'ouverture (Pas encore fonctionnel)
      </h1> */}
      <div className="space-y-4">
        <Button
          variant={"outline"}
          onClick={() => setOpeningHours(open24Hours)}
        >
          Ouvert tous les jours - H24
        </Button>{" "}
        <Button
          variant={"outline"}
          onClick={() => setOpeningHours(open24HoursButSunday)}
        >
          Ouvert tous les jours H24 sauf dimanche
        </Button>{" "}
        <br />
      </div>
      {/* Boucle sur chaque jour de la semaine pour créer des inputs avec les labels en français */}
      {Object.keys(openingHours).map((day) => (
        <div key={day} className="grid grid-cols-3 gap-4 items-center">
          <Label htmlFor={`${day}-open`} className="capitalize">
            {daysOfWeekInFrench[day as keyof typeof openingHours]}
          </Label>
          <div className="space-y-2">
            <Label htmlFor={`${day}-open`} className="sr-only">
              Ouvert
            </Label>
            <Input
              className="border max-w-[100px]"
              id={`${day}-open`}
              type="time"
              value={openingHours[day as keyof typeof openingHours].open}
              onChange={(e) =>
                handleChange(
                  day as keyof typeof openingHours,
                  "open",
                  e.target.value
                )
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${day}-close`} className="sr-only">
              Fermé
            </Label>
            <Input
              className="border max-w-[100px]"
              id={`${day}-close`}
              type="time"
              value={openingHours[day as keyof typeof openingHours].close}
              onChange={(e) =>
                handleChange(
                  day as keyof typeof openingHours,
                  "close",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpdateOpeningHours;
