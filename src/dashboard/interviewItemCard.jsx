import React from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from "react-router-dom";

function InterviewItemCard({ interview }) {
  const navigate = useNavigate(); 

  const onStart = () => {
    navigate(`/dashboard/interview/${interview?.mockId}`); 
  };

  const onFeedback = () => {
    navigate(`/dashboard/interview/${interview?.mockId}/feedback`); 
  };

  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-sm text-gray-400'>{interview?.createdAt}</h2>
      <div className='flex justify-between mt-2 gap-5'>
        <Button size='sm' variant='outline' className='w-full' onClick={onFeedback}>Feedback</Button>
        <Button size='sm' className='w-full' onClick={onStart}>Start</Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
