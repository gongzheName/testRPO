import React, { useMemo, useState, useEffect, useCallback } from "react";
// import "./styles.css";
const time = 60;
const TimeDown = () => {
    const [isRestart, setRestart] = useState(false);
    const [tempTime, setTempTime] = useState(60);
    useEffect(() => {
        if (tempTime <= 0) return;
        const timeout = setTimeout(() => {
            setTempTime(tempTime - 1);
            clearTimeout(timeout);
        }, 1000);
    }, [tempTime]);
    return (
        <div>
        倒计时: {tempTime}
        </div>
    );
};

// class TimeDown extends React.PureComponent {
//     state = {
//         timedown: 60,
//     };
//     handleTimedown = () => {
//         this.setState({
//             timedown: this.state.timedown - 1,
//         });
//     }
//     componentDidMount() {
//         setInterval(() => {
//             this.handleTimedown();
//         }, 1000);
//     }
//     render() {
//         return (
//             <div>{this.state.timedown}</div>
//         )
//     }
// }

console.log('commit1');
export default TimeDown;

console.log('commit2');
console.log('commit3');