// // import React from 'react'
// import { SignIn } from "@clerk/clerk-react";

// function SignInPage() {
//   return (
//     <div className="flex justify-center py-7">
//       <SignIn />
//     </div>
//   );
// }

// export default SignInPage;

import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react"; // or "@clerk/nextjs" if you're using Next.js
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function SignInPage() {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      if (email === "joyalkuriakose49@gmail.com") {
        navigate("/Admin/home");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isSignedIn, user, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen py-7">
      <SignIn />
    </div>
  );
}

export default SignInPage;
