import React, { useEffect, useState } from 'react';
import "../App.css";
import { get_rubrics_with_scores, updateScore, createScore } from "@/lib/api"; // Ensure correct import paths

const GradingCriteria = ({ answerId }) => {
  const [rubrics, setRubrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!answerId) return;

    const fetchRubrics = async () => {
      setLoading(true);
      try {
        const rubricsData = await get_rubrics_with_scores(answerId);
        setRubrics(rubricsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRubrics();
  }, [answerId]);

  /**  
  const handleScoreChange = async (newScore, rubricId, scoreId) => {
    if (newScore == 'No score') {
        newScore = -1
    }
    if (scoreId == null)  {
        const score_id = await createScore(rubricId, answerId, newScore )
        console.log(score_id)
        console.log(rubrics)
        const updatedRubrics = rubrics.map(rubric => {
            if (rubric.id === rubricId) {
                return {
                    ...rubric,
                    points: newScore,
                    score_id: score_id
                };
            }
            return rubric;
        });
        setRubrics(updatedRubrics);
        console.log(rubrics)
        


    } else {
        await updateScore(rubricId, scoreId, newScore)
        const updatedRubrics = rubrics.map(rubric => {
            if (rubric.id === rubricId) {
                // Update the score object with new points and potentially new scoreId
                return {
                    ...rubric,
                    points: newScore
                };
            }
            return rubric;
        });
        setRubrics(updatedRubrics);
    }

  };
  */
  const handleScoreChange = async (newScore, rubricId, scoreId) => {
    let optimisticUpdatedRubrics = rubrics.map(rubric => {
        if (rubric.id === rubricId) {
            return { ...rubric, points: newScore === 'No score' ? -1 : newScore };
        }
        return rubric;
    });

    // Update UI immediately before the request is made
    setRubrics(optimisticUpdatedRubrics);

    try {
        if (newScore === 'No score') {
            newScore = -1;
        }

        let score_id = scoreId;

        if (scoreId == null) {
            score_id = await createScore(rubricId, answerId, newScore);
        } else {
            await updateScore(rubricId, scoreId, newScore);
        }

        // Successfully updated the backend, confirm the update
        setRubrics(optimisticUpdatedRubrics.map(rubric => {
            if (rubric.id === rubricId) {
                return { ...rubric, score_id };
            }
            return rubric;
        }));
    } catch (error) {
        // Handle error, revert to previous state if needed
        console.error("Failed to update score:", error);
        setRubrics(rubrics); // Revert to the original rubrics if error occurs
    }
};




  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grading-criteria" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {rubrics.map(rubric => (
        <div key={rubric.id} className="rubric-item" style={{ border: '1px solid gray', padding: '10px', margin: '5px', flexBasis: '30%', boxSizing: 'border-box' }}>
          <p>Criteria: {rubric.criteria}</p>
          <select
            value={rubric.points && rubric.points !== -1 ? rubric.points : 'No score'}
            onChange={(e) => handleScoreChange(e.target.value, rubric.id, rubric.score_id ? rubric.score_id : null)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="No score">No Score</option>
            {Array.from({ length: rubric.score + 1 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default GradingCriteria;
