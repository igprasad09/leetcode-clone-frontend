import { atom } from 'recoil';

export interface User {
  email: string;
  password: string;
};

interface newUser{
     username: string,
     email: string,
     password: string
}

export const userAtom = atom<User>({
  key: "userAtom",
  default: { email: "", password: "" },
});

export const newUserAtom = atom<newUser>({
    key:"newuser",
    default:{ username: "", email: "", password: ""}
})

export const otpAtom = atom({
  key: "otpAtom",
  default: ""
});

export const otpLoadingAtom = atom({
   key: "otpLoading",
   default: false
})

export const wordsAtom = atom({
   key: "wordsatom",
   default: [
       {
         text: "”",
       },
       {
         text: "QUALITY",
       },
       {
         text: "OVER",
       },
       {
         text: "QUANTITY ",
         className: "text-blue-500 dark:text-blue-500",
       },
       {
         text: "”",
       },
     ]
});

export const profileEmailAtom = atom({
    key: "profileAtom",
    default: ""
});

type program = {
    id: string,
    title: string,
    difficulty: string,
    category: string,
    solutionlink: string
}

export const allprogramNamesAtom = atom<program[]>({
     key: "allprogramsnamesatom",
     default: []
})

type programdet = {
     constraints: object,
     description: string,
     difficulty: string,
     dislike: string,
     examples: string,
     id: string,
     like: string,
     title: string,
     visibility: string
}

export const programInfoAtom = atom<programdet |any>({
      key:"programInfo",
      default: null
});

export const languageAtom = atom({
      key: "languageAtom",
      default: "javascript"
});

export const profileImageAtom = atom({
     key: "progileImageAtom",
     default:""
});

export const textsizeAtom = atom({
     key: "sizeAtom",
     default: 17
});

export const exeCode = atom({
   key:"exeCodeatom",
   default:null
});

export const outputAtom = atom({
     key:"outputAtom",
     default: null
});

export const resultAtom = atom({
     key: "resultAtom",
     default: {}
});

export const submitionAtom = atom({
    key:"submitionAtom",
    default: []
})