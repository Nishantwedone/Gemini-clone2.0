import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState(" ");
  const [recentprompt, setRecentPrompt] = useState(" "); // empty strings
  const [prevPrompts, setPrevPrompts] = useState([]); // empty array
  const [ShowResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(" ");

  // for typing effect
  const delaypara = (index, nextWord) => {
    setTimeout(function () {
      setResultData(prev => prev + nextWord);
    }, 75*index)
  }

  const newChat = () =>{
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if(prompt !== undefined){
      response = await run(prompt)
      setRecentPrompt(prompt);
    }
    else{
      setPrevPrompts(prev =>[...prev,input])
      setRecentPrompt(input)
      response = await run(input)
    }

    // save prev data prompt
    
    // const response = await run(input);

    // this is for doing boldness in generated text on highlights points
    let responseArray = response.split("**");
    let newResponse ="";
    for(let i = 0; i< responseArray.length; i++){
      if(i === 0 || i%2 !== 1){
        newResponse += responseArray[i];
      }
      else{
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    // setResultData(newResponse2);
    let newResponseArray = newResponse2.split(" ");
    for(let i=0; i< newResponseArray.length ;i++){
      const nextWord = newResponseArray[i];
      delaypara(i,nextWord + " ");
    }

    setLoading(false);
    setInput("");
  }
  // onSent("what is react js?")

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentprompt,
    ShowResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
