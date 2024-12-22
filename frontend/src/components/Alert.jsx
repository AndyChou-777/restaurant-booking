import React, { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

    {/**
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertDescription, setAlertDescription] = useState('');

    const showTemporaryAlert = (title, description) => {
    
        setShowAlert(true);
        setAlertTitle(title);
        setAlertDescription(description);
        
        setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        
        return (
        <>
        {/* Alert 控制區塊 */}
{/*}
        {showAlert && (
            <Alert className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black border border-black p-4 shadow-lg z-50 w-[500px] rounded-[8px]">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className='font-bold'>{title}</AlertTitle>
            <AlertDescription>
            {description}
            </AlertDescription>
            </Alert>
        )}

        </>
        );
    };*/}

export default Alert;