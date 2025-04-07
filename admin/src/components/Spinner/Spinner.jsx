import {  CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

// Updated CSS to center the spinner both vertically and horizontally
const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#667bda",
    position: "absolute", // Ensure it's positioned absolutely
    top: "50%", // Vertically center
    left: "50%", // Horizontally center
    transform: "translate(-50%, -50%)", // Align center point
};

function Spinner({ loading, size = 60 }) { // Increased default size to 60
    return (
        <ClipLoader
            color={"#667bda"} // Changed color to match the borderColor
            loading={loading}
            cssOverride={override}
            size={size} // Increased size for a bigger spinner
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    );
}

export default Spinner;
