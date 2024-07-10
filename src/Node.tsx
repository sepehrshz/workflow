import { useState } from "react";

const Node = ({userLog}) => {
    const [click, setClick] = useState(false)
    return (
        <>
            <div>{userLog.userName}</div>
            <div>{userLog.result && `Result: ${userLog.result}`}</div>
            <div>IP: {userLog.clientIp}</div>
            <div>IpDesc: {userLog.clientIpDesc}</div>
            {userLog.status == "connected" ? 
                <svg height="10" width="10">
                    <circle r="5" cx="5" cy="5" fill="green"/>
                </svg> : 
                <svg height="10" width="10">
                    <circle r="5" cx="5" cy="5" fill="red"/>
                </svg>
            }
            <div>Session ID: {userLog.sessionIdentifier}</div>
            <button onClick={() => setClick(prevClick => !prevClick)}>Click me!</button>
            {click && <div>jfoaipehihahfofa</div>}
        </>
    );
}

export default Node;