import { MailIcon, MessageCircleIcon } from "lucide-react";
import BoarderAnimatedContainer from "../components/BoarderAnimatedContainer";

const VerifyEmail = () => {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl md:h-[500px] h-[300px]">
        <BoarderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="w-full p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <MailIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">
                    Verify your email...
                  </h2>
                  <p className="text-slate-400">
                    We sent you a verification email, Click to verify your
                    email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BoarderAnimatedContainer>
      </div>
    </div>
  );
};

export default VerifyEmail;
