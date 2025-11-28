import React, { useState } from "react";


export default function DialogModal() {
    const [showGenerateDialog, setShowGenerateDialog] = useState(false);

    const handleGenerateReport = () => {
        setShowGenerateDialog(true);
    };

    const handleSearchDialog = (query) => {
        if(!query.trim()) {
            return;
        }
    }
    return (
        <></>
    );
}
