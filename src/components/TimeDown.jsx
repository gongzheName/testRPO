import React, { useMemo, useState, useEffect } from "react";
// import "./styles.css";
const time = 60;
const TimeDown = () => {
    const [isRestart, setRestart] = useState(false);
    const [tempTime, setTempTime] = useState(60);
    // useEffect(() => {
    //     if (time <= 0) {
    //         setRestart(true);
    //     }
    // }, [time]);
    // const interval = setInterval(() => {
    //     // clearInterval(timeOut);
    //     console.log(tempTime);
    //     setTempTime(tempTime - 1);
    // }, 1000);
    return (
        <div>
        倒计时: {tempTime}
        </div>
    );
};

export default TimeDown;
