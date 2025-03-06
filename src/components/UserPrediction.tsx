import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";

interface UserPredictionProps {
  onPredictionSubmit: (predictions: {
    timePrediction: string;
    velocityPrediction: string;
    trajectoryChoice: string;
  }) => void;
}

const UserPrediction: React.FC<UserPredictionProps> = ({
  onPredictionSubmit,
}) => {
  const [timePrediction, setTimePrediction] = useState("");
  const [velocityPrediction, setVelocityPrediction] = useState("");
  const [trajectoryChoice, setTrajectoryChoice] = useState("quickest");

  const handleSubmit = () => {
    // Ensure both predictions are provided before submitting
    if (timePrediction && velocityPrediction) {
      onPredictionSubmit({
        timePrediction,
        velocityPrediction,
        trajectoryChoice,
      });
    }
  };

  return (
    <Box p="4" borderWidth="1px" borderRadius="md" mb="4">
      <FormControl mb="3">
        <FormLabel>Time to reach the bottom</FormLabel>
        <Input
          placeholder="e.g. 2.5"
          value={timePrediction}
          onChange={(e) => setTimePrediction(e.target.value)}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>Terminal velocity</FormLabel>
        <Input
          placeholder="e.g. 12.3"
          value={velocityPrediction}
          onChange={(e) => setVelocityPrediction(e.target.value)}
        />
      </FormControl>
      <FormControl mb="3">
        <FormLabel>Choose trajectory</FormLabel>
        <RadioGroup onChange={setTrajectoryChoice} value={trajectoryChoice}>
          <Stack direction="row">
            <Radio value="quickest">Quickest trajectory</Radio>
            <Radio value="none">None</Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isDisabled={!timePrediction || !velocityPrediction}
      >
        Submit Predictions
      </Button>
    </Box>
  );
};

export default UserPrediction;
