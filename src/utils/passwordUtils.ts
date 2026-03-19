import bcrypt from 'bcrypt';

/**
 * 비밀번호를 해시화합니다.
 * @param password 평문 비밀번호
 * @param saltRounds 솔트 라운드 수 (기본값: 10)
 * @returns 해시화된 비밀번호
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * 평문 비밀번호와 해시화된 비밀번호를 비교합니다.
 * @param password 평문 비밀번호
 * @param hashedPassword 해시화된 비밀번호
 * @returns 일치 여부
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 비밀번호 유효성 검증
 * @param password 검증할 비밀번호
 * @returns 검증 결과와 메시지
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  // if (password.length < 8) {
  //   return { isValid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
  // }
  
  // if (!/[A-Z]/.test(password)) {
  //   return { isValid: false, message: '비밀번호는 대문자를 포함해야 합니다.' };
  // }
  
  // if (!/[a-z]/.test(password)) {
  //   return { isValid: false, message: '비밀번호는 소문자를 포함해야 합니다.' };
  // }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: '비밀번호는 숫자를 포함해야 합니다.' };
  }
  
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   return { isValid: false, message: '비밀번호는 특수문자를 포함해야 합니다.' };
  // }
  
  return { isValid: true, message: '비밀번호가 유효합니다.' };
}
