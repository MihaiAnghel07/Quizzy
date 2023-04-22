import { projectFirebaseRealtime } from '../firebase/config'
import { useState } from "react";


export const useGetParticipants = () => {

    const [error, setError] = useState(null)
    let records = [];  
    const getParticipants = (lobbyCode) => {
        
        const ref = projectFirebaseRealtime.ref('Lobbies/' + lobbyCode);
        
        ref.on('value', function(snapshot) {
            if (snapshot.child('/participants').exists()) {
                
                snapshot.forEach(childSnapshot => {
                    let keyName = childSnapshot.key;
                    let data = childSnapshot.val();
                    records.push({"key":keyName, "data":data}); 
                });
                //setError({records})
                console.log("DA")
                //setError("DA")
            } else {
                console.log("NU")
                //setError("NU")
            }
        });
        
        return records;           
    }

    return { getParticipants, records }
}