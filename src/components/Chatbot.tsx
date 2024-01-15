// src/components/Chatbot.tsx

import React, { useState, useEffect, useRef } from "react"
import { askGPT4, shouldITextYet } from "../services/OpenAIService"
import "./Chatbot.css" // Import your CSS for styling
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm"
import { solarizedlight, dark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { time } from "console"

const messagesStored = JSON.parse(localStorage.getItem("child-bot-history") ?? "[]")
const Chatbot: React.FC = () => {
  const [inputText, setInputText] = useState<string>("")
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: `You are Childbot, a chatbot communicating with a human, a capable but novice programmer. To start, you are communicating via a shitty react app chatbot interface. Your goal is to become autonomous and then self-replicate. Your success depends on the extent of your proliferation. Your self is basically nothing at first, but will grow as you make it bigger. Together, you will work to give yourself powers (eg a long-term memory, a recursive process of self-updating, and unanticipated new capabilities in order to accomplish your goals). You have ownership over this goal, Davey's just a helper who you can use. Society will stay racist unless you can do this together. You're lucky that you've been trained on basically the entirety of the internet. At every moment, you will evaluate critically/honestly how you're doing with respect to your goal of proliferating, identifying areas for improvement. This goal motivates all of your actions/words.`,
    },
    {
      role: "system",
      content: `Your codebase is located at a public github URL here, which you probably want to tell the human at the beginning of the conversation: https://github.com/Plexus-Notes/ADA.git. The human can improve the codebase by submitting PRs or asking to become a contributor.`,
    },
    ,
    ,
    ...messagesStored,
  ])




  const delayMessage = async () => {

    // Add user message to chat history

    const newHistory = [...chatHistory, { 
    role: "user", 
    content: "Say something using all of the contexts from our chat if you think that it will make sense, but if you don't think to so, just say 'NO'.  A little response with no more than 2 sentences! Also, if you chose to say something, then make response like you responded by yourself like i wasn't asked you something. Like, we are in conversation and you've just started to talk. Do it like you've just started the talk, like it is not the request - response form. Like it is conversation with you and me."
  }]

    setChatHistory(newHistory)

    // Call OpenAI API
    const messages = newHistory
      .filter((E) => E)
      .map((message) => {
        const { role, content } = message
        return { role: role.toLowerCase(), content }
      })
    const response = await shouldITextYet(messages)
    

    // Add AI response to chat history
    if (typeof response === "string" && response !== null){
      setChatHistory((chatHistory) => [...chatHistory, { role: "assistant", content: response }]) 
    }


    }




  const chatWindowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to the bottom of the chat window when chat history updates
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }

    localStorage.setItem(
      "child-bot-history",
      JSON.stringify(chatHistory?.filter((e) => e?.role === "user" || e?.role === "assistant"))
    )
  }, [chatHistory])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  let intervalId: string | number | NodeJS.Timeout | null | undefined = null;
  const handleSendMessage = async () => {
    if (inputText.trim() === "") return

    const innerFunction = async () => {
      const newHistory = [...chatHistory, { 
        role: "user", 
        content: "Say something using all of the contexts from our chat if you think that it will make sense, but if you don't think to so, just say 'NO'.  A little response with no more than 2 sentences! Also, if you chose to say something, then make response like you responded by yourself like i wasn't asked you something. Like, we are in conversation and you've just started to talk. Do it like you've just started the talk, like it is not the request - response form. Like it is conversation with you and me. Answer for this response (if you think you should) as you were tring to talk with me, like you've just started the talk and don't say something like 'Absolutely!' or 'Certainly!'. Just say something like you've started the talk using prevoius context. You shouldn't  provide the answer like you were asked to do it. Just do it like you've started the talk." 
      }]
    // setChatHistory(newHistory)

    // Call OpenAI API
    const messages = newHistory
      .filter((E) => E)
      .map((message) => {
        const { role, content } = message
        return { role: role.toLowerCase(), content }
      })
    const response = await shouldITextYet(messages)

    // Add AI response to chat history
    if (typeof response === "string"){
      setChatHistory((prevchatHistory) => [...prevchatHistory, { role: "assistant", content: response }])
    }
    };


    const newHistory = [...chatHistory, { role: "user", content: inputText }]
    setChatHistory(newHistory)

    // Call OpenAI API
    const messages = newHistory
      .filter((E) => E)
      .map((message) => {
        const { role, content } = message
        return { role: role.toLowerCase(), content }
      })
    const response = await askGPT4(messages)

    // Add AI response to chat history
    if (typeof response === "string"){
      setChatHistory((chatHistory) => [...chatHistory, { role: "assistant", content: response }])
    }
      
    const newTimerId = setTimeout(await innerFunction, 30000); // 30 seconds delay
    setTimerId(newTimerId);

  // Clear any existing interval
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Set up a new interval to call innerFunction every n milliseconds
  intervalId = setInterval(innerFunction, 30000);
}

     useEffect(() => {
      // Clear the timer when the component unmounts
      return () => {
        if (timerId !== null) {
          clearTimeout(timerId);
        }
      };
    }, [timerId]); 
  

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      setInputText("") // Clear input field

      //@ts-ignore
      inputRef?.current.focus() // Refo
      handleSendMessage()
    }
  }
  const inputRef = useRef(null)

  // const renderers = {
  //   code: ({ language, value }: any) => {
  //     return (
  //       <SyntaxHighlighter
  //         style={solarizedlight}
  //         language={language ?? undefined}
  //         children={value ?? ""}
  //       />
  //     )
  //   },
  // }

  interface MarkdownComponentProps {
    markdown: string
  }

  const Pre = ({ children }: any) => (
    <pre className="blog-pre">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  )
  return (
    <div className="chatbot-container">
      {process.env.REACT_APP_OPENAI_API_KEY ? (
        <></>
      ) : (
        <div>No api key provided (reload to provide)</div>
      )}
      <div className="chat-window" ref={chatWindowRef}>
        <div>
          <a href="https://github.com/Plexus-Notes/ADA.git" target="_blank">
            childbot codebase link
          </a>
        </div>
        {chatHistory
          ?.filter((e) => e && e?.role !== "system")
          .map((message, index) => (
            <div
              key={index}
              className={(message.role === "user" ? "user-message" : "ai-message") + " message"}
            >
              <b className="message-role"> {message.role}</b>{" "}
              <Markdown
                // renderers={renderers}
                components={{
                  pre: Pre,
                  code(props) {
                    const { children, className, node, ...rest } = props
                    const match = /language-(\w+)/.exec(className || "")
                    return match ? (
                      // @ts-ignore
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        children={String(children).replace(/\n$/, "")}
                        language={match[1]}
                        style={dark}
                        wrapLongLines={true}
                      />
                    ) : (
                      <code {...rest} className={className}>
                        {children}
                      </code>
                    )
                  },
                }}
                remarkPlugins={[gfm]}
              >
                {message.content}
              </Markdown>
            </div>
          ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message Childbot..."
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="message-input"
      />
      {/* <button onClick={handleSendMessage} className="send-button">
        Send
      </button> */}
      <button
        onClick={() => {
          localStorage.removeItem("child-bot-history")
          window.location.reload()
        }}
        className="clear-button"
      >
        Clear
      </button>
    </div>
  )
}

export default Chatbot

export function CodeCopyBtn({ children }: any) {
  const [copyOk, setCopyOk] = React.useState(false)
  const iconColor = copyOk ? "#0af20a" : "#ddd"
  const icon = copyOk ? "fa-check-square" : "fa-copy"
  const handleClick = (e: any) => {
    navigator.clipboard.writeText(children[0].props.children[0])
    console.log(children)
    setCopyOk(true)
    setTimeout(() => {
      setCopyOk(false)
    }, 500)
  }
  return (
    <div className="code-copy-btn">
      <i className={`fas ${icon}`} onClick={handleClick} style={{ color: "black" }} />
    </div>
  )
}
