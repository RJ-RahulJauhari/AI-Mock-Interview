import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Webcam from "react-webcam";

const RecordAnswerSection = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-3">
        Camera
      </h2>

      <div className="w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg overflow-hidden mb-4">
        {(
          <Webcam
            className="w-full h-full object-cover"
            audio={true}
          />
        )}
      </div>

      <Button className="font-semibold" variant="outline" onClick={handleRecordToggle}>
        {isRecording ? "Stop Recording" : "Record Answer"}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;
