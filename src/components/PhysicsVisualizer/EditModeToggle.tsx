import React from "react";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

interface EditModeToggleProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

export const EditModeToggle = ({
  isEditMode,
  toggleEditMode,
}: EditModeToggleProps) => {
  return (
    <FormControl
      display="flex"
      alignItems="center"
      mt={4}
      justifyContent="flex-start"
      width="100%"
    >
      <FormLabel htmlFor="edit-mode" mb="0" fontWeight="bold">
        Edit Mode
      </FormLabel>
      <Switch
        id="edit-mode"
        isChecked={isEditMode}
        onChange={toggleEditMode}
        colorScheme="purple"
        size="lg"
      />
    </FormControl>
  );
};
