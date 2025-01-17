import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/store';
import "./ShowFriendRequests.css";

const ShowFriendRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
          throw new Error("You need to be logged in to view requests.");
        }

        const response = await fetch(`http://localhost:8080/api/requests/received/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch received requests.");
        }

        

        const data = await response.json();

        const sortedRequests = data.sort((a: any, b: any) => {
          const dateA = new Date(a.requestDate);
          const dateB = new Date(b.requestDate);
          return dateB.getTime() - dateA.getTime(); // descending order
        });
  
        setReceivedRequests(sortedRequests);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching received requests.");
      }
    };

    if (userId) {
      fetchReceivedRequests();
    }
  }, [userId]);

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("You need to be logged in to accept requests.");

      const response = await fetch(`http://localhost:8080/api/requests/accept/${requestId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to accept friend request.");
      }


      setReceivedRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, accepted: true } : request
        )
      );
    } catch (err: any) {
      setError(err.message || "An error occurred while accepting the request.");
    }
  };

  const handleDeclineRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("You need to be logged in to decline requests.");

      const response = await fetch(`http://localhost:8080/api/requests/decline/${requestId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to decline friend request.");
      }

      
      setReceivedRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (err: any) {
      setError(err.message || "An error occurred while declining the request.");
    }
  };

  return (
    <div className='friend-request-container'>
      {error && <p className="error-message">{error}</p>}
      <h2 className="friend-request-page-title">Friend Requests</h2>
      {receivedRequests.length === 0 ? (
        <p>No received requests.</p>
      ) : (
        <ul className="request-ul">
          {receivedRequests.map((request: any) => (
            <li className="request-li" key={request.id}>
              <p className="from-p">{request.senderName} {request.senderSurname} ({request.senderUsername})</p>
              <p>{new Date(request.requestDate).toLocaleString()}</p>
              <p>Hi there! Do you want to be my friend?</p>
              {!request.accepted && (
                <div className="friend-request-button-wrapper">
                  <button className="accept-request-button" onClick={() => handleAcceptRequest(request.id)}>Accept</button>
                  <button className="decline-request-button" onClick={() => handleDeclineRequest(request.id)}>Decline</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowFriendRequests;
