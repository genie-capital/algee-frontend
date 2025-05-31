import React, { useEffect, useState, useRef } from 'react';
import { EyeIcon, EyeOffIcon, CheckIcon } from 'lucide-react';
interface PasswordResetFormProps {
  onComplete: () => void;
}
const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onComplete
}) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to send the verification code
    setStep(2);
    setTimeLeft(300);
    setCanResend(false);
  };
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      // Auto-advance to next input
      if (value !== '' && index < 5) {
        codeInputs.current[index + 1]?.focus();
      }
    }
  };
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && index > 0 && !verificationCode[index]) {
      codeInputs.current[index - 1]?.focus();
    }
  };
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would validate the verification code
    setStep(3);
  };
  const handleResendCode = () => {
    // Here you would trigger resending the code
    setTimeLeft(300);
    setCanResend(false);
  };
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the new password
    setStep(4);
    onComplete();
  };
  return <div className="w-full">
      {step === 1 && <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <p className="mb-4 text-gray-600">
              Enter your registered email address to receive password reset
              instructions
            </p>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input type="email" id="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="w-full px-4 py-3 text-white bg-[#07002F] rounded-md hover:bg-opacity-90">
            Send Reset Link
          </button>
        </form>}
      {step === 2 && <form onSubmit={handleVerifyCode} className="space-y-6">
          <div>
            <p className="mb-4 text-gray-600">
              Enter the 6-digit code sent to your email address
            </p>
            <div className="flex justify-between gap-2">
              {verificationCode.map((digit, index) => <input key={index} ref={el => codeInputs.current[index] = el} type="text" placeholder="-" maxLength={1} className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={digit} onChange={e => handleCodeChange(index, e.target.value)} onKeyDown={e => handleCodeKeyDown(index, e)} />)}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>Code expires in: {formatTime(timeLeft)}</p>
              {canResend && <button type="button" onClick={handleResendCode} className="text-[#008401] hover:underline mt-2">
                  Resend Code
                </button>}
            </div>
          </div>
          <button type="submit" className="w-full px-4 py-3 text-white bg-[#07002F] rounded-md hover:bg-opacity-90">
            Verify Code
          </button>
        </form>}
      {step === 3 && <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password *
            </label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} id="password" required minLength={8} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            <div className="mt-1 text-sm text-gray-500">
              <p>Password must:</p>
              <ul className="list-disc pl-5">
                <li>Be at least 8 characters long</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password *
            </label>
            <input type="password" id="confirmPassword" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07002F]" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full px-4 py-3 text-white bg-[#008401] rounded-md hover:bg-opacity-90">
            Reset Password
          </button>
        </form>}
      {step === 4 && <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#008401] rounded-full mx-auto flex items-center justify-center">
            <CheckIcon size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-medium text-gray-900">
            Password Reset Successfully
          </h3>
          <p className="text-gray-600">
            Your password has been reset. You can now use your new password to
            sign in.
          </p>
        </div>}
    </div>;
};
export default PasswordResetForm;