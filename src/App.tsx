import { useEffect, useState } from 'react';
import './App.css';
import { isAddress } from 'viem';

function App() {
  const [address, setAddress] = useState<string>('');
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isAddress(address)) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://prod.backend.prop.house/votes/by/${address}`
        );
        setLoading(false);
        const votes = await response.json();
        const votesFrom2023 = votes.filter((vote: any) => {
          const createdAt = new Date(vote.createdDate);
          const beg = new Date('2023-01-01');
          return createdAt > beg;
        });
        const sorted = votesFrom2023.sort((a: any, b: any) => {
          return a.createdDate > b.createdDate ? -1 : 1;
        });
        setVotes(sorted);
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    };
    fetchData();
  }, [address]);

  const totalVoteWeight = (votes: any[]) =>
    votes.reduce((prev, current) => {
      return prev + current.weight;
    }, 0);

  const uniqueProps = (votes: any[]) => {
    const uniqueProposalIds = new Set<string>();
    votes.forEach((vote) => {
      uniqueProposalIds.add(vote.proposalId);
    });
    return uniqueProposalIds.size;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date
      .getFullYear()
      .toString()
      .slice(-2)}`;
    return formattedDate;
  };

  return (
    <div className="container">
      <img
        src="https://prop.house/bulb.png"
        className="logo"
        alt="prop-house-bulb"
      />
      <div className="header">View your activity on Prop House for 2023</div>
      <div className="inputcontainer">
        <input
          type="text"
          className="input"
          placeholder="Enter your address"
          onChange={(value) => {
            setAddress(value.currentTarget.value);
          }}
        />
      </div>
      {loading && <div className="loading">Loading...</div>}
      {votes.length > 0 && (
        <>
          <div className="statsHeader">
            You allocated {totalVoteWeight(votes)} votes across{' '}
            {uniqueProps(votes)} proposals in 2023
          </div>
        </>
      )}

      <div className="votesContainer">
        {votes.length > 0 &&
          votes.map((vote) => {
            return (
              <div>
                <b>
                  {vote.weight} vote{vote.weight > 1 ? 's' : ''}
                </b>{' '}
                for <b>{vote.proposal.title}</b> on{' '}
                {formatDate(vote.createdDate)}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
