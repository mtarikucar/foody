import { useState, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#4B0082",
};

function Spinner({loading, size = 20}) {

    return (

            <ClipLoader
                color={"#fff"}
                loading={loading}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
                FadeLoader={2}
            />
    );
}

export default Spinner;
