import React from "react";
function LandingPage() {
    return (
        <>
            <div className="h-[calc(100vh-5rem)] flex justify-center items-center w-full">
                <div className="px-2 py-6 ">
                    <div className="flex gap-10 justify-center mt-10">
                        <div className="w-8 h-8 bg-dynamic rounded-full animate-bounce" />
                        <div className="w-8 h-8 bg-dynamic rounded-full animate-bounce" />
                        <div className="w-8 h-8 bg-dynamic rounded-full animate-bounce" />
                    </div>
                </div>
            </div>
        </>
    );
}

export default LandingPage;
