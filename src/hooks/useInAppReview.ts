import { useEffect, useState } from 'react';
import InAppReview from 'react-native-in-app-review';

const useInAppReview = () => {
  const [isReviewAvailable, setIsReviewAvailable] = useState(false);

  useEffect(() => {
    setIsReviewAvailable(InAppReview.isAvailable());
  }, []);

  const openInAppReview = () => {
    if (isReviewAvailable) {
      InAppReview.RequestInAppReview()
        .then((hasFlowFinishedSuccessfully) => {
          console.log('Rating thanh cong:', hasFlowFinishedSuccessfully);
        })
        .catch((error) => {
          console.error('Loi rating---:', error);
        });
    }
  };

  return { openInAppReview };
};

export default useInAppReview;