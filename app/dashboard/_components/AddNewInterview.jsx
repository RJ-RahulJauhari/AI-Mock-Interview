"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"


const AddNewInterview = () => {
    const [openDialog,setOpenDialog] = useState(false);
  return (
    <div>
        <div onClick={() => {setOpenDialog(!openDialog)}} className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md hover:cursor-pointer transition-all'>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
        </div>
      <Dialog open={openDialog}>
        <DialogTrigger>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>

    </div>
  )
}

export default AddNewInterview
