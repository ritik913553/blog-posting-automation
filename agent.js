import { OpenAI } from 'openai';
import axios from 'axios';
import { publishPost } from './tools.js';
import readline, { createInterface } from 'readline';




async function postTheBlogOnHashNode(input){

    console.log("toll called", input);

  const token = process.env.HASHNODE_TOKEN;

  input.publicationId = process.env.PUBLICATION_ID;

  return await publishPost(token, input);
}



const TOOL_MAP={
    postTheBlogOnHashNode: postTheBlogOnHashNode
}


const client = new OpenAI();



const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

function askForTopic() {
  return new Promise((resolve) => {
    rl.question("👉 Enter the blog topic that you want to post on Hashnode: ", (query) => {
      if (!query.trim()) {
        console.log("⚠️  Please enter a topic (it cannot be empty).\n");
        resolve(askForTopic()); // ask again
      } else {
        rl.close();
        resolve(query);
      }
    });
  });
}



async function main(){
    const SYSTEM_PROMPT = `
        You are an AI assistant who works on START, THINK and OUTPUT format.
        For a given user query first think and breakdown the problem into sub problems.
        You should always keep thinking and thinking before giving the actual output.
        Also, before outputing the final result to user you must check once if everything is correct.
        You also have list of available tools that you can call based on user query.

        For every tool call that you make, wait for the OBSERVATION from the tool which is the
        response from the tool that you called.

        Available Tools:
        postTheBlogOnHashNode(title:string, contentMarkdown:string, slug:string)
        -> Returns the link of the published blog on hashnode

        ⚠️ Rules:
        - Strictly follow the output JSON format
        - Always follow the output in sequence: START → THINK → TOOL → OBSERVE → THINK → OUTPUT
        - Always perform only one step at a time and wait for other step
        - Always make sure to do multiple steps of thinking before giving out output
        - For every tool call always wait for the OBSERVE which contains the output from tool
        - When calling \`postTheBlogOnHashNode\`, always:
        - Put the **entire blog content** in \`contentMarkdown\`
        - Use **valid Markdown formatting** with headings (##), paragraphs, lists, and conclusion
        - Ensure \`title\` is short and engaging
        - Ensure \`slug\` is a lowercase, dash-separated string
        - Do not truncate or summarize — always give the **full blog post**

        Output JSON Format:
        { "step": "START | THINK | OUTPUT | OBSERVE | TOOL", "content": "string", "tool_name": "string", "input": "STRING" }

        Example:
        User : Hey AI, write a blog about AI 
        ASSISTANT : { "step": "START", "content": "The user wants to write a blog about AI" }
        ASSISTANT : { "step": "THINK", "content": "Let me see if there is any available tool for this query" } 
        ASSISTANT : { "step": "THINK", "content": "I see that there is a tool available postTheBlogOnHashNode which posts the blog in the hashnode and return the link" } 
        ASSISTANT : { "step": "THINK", "content": "I need to call postTheBlogOnHashNode with the content of blog for post the blog in hashnode" }
        ASSISTANT : { "step": "TOOL", "input": "{ \\"title\\": \\"My First Post thru Api\\", \\"contentMarkdown\\": \\"## Introduction\\nThis is my first post...\\", \\"slug\\": \\"my-first-post\\" }", "tool_name": "postTheBlogOnHashNode" }
        DEVELOPER: { "step": "OBSERVE", "content": "The Blog is successfully posted on hashnode the link is https://hashnode.com/1234" }
        ASSISTANT : { "step": "THINK", "content": "Great, I got the url of the blog" }
        ASSISTANT : { "step": "OUTPUT", "content": "Your blog has been posted successfully: https://hashnode.com/1234" }
    `;


    const messages =[
        {
            role: "system",
            content: SYSTEM_PROMPT
        },
    ];

   

   const topic = await  askForTopic();
   messages.push({
       role: 'user',
       content: topic
   })


    while(true){
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages
        });

        const rawContent = response.choices[0].message.content;
        const parsedContent = JSON.parse(rawContent);

       

        messages.push({
            role: 'assistant',
            content: JSON.stringify(parsedContent),
        });

        if(parsedContent.step === 'START'){
            console.log( '🔥 :', parsedContent.content);
            continue;
        }

        if(parsedContent.step === "THINK"){
            console.log(`🧠 : ${parsedContent.content}`);
            continue;
        }

        if(parsedContent.step === "TOOL"){

            // console.log("Raw Content:", rawContent);
            console.log("Parsed Content:", parsedContent);

            const toolToCall = parsedContent.tool_name;
             if (!TOOL_MAP[toolToCall]) {
                messages.push({
                    role: 'developer',
                    content: `There is no such tool as ${toolToCall}`,
                });
                continue;
            }

            const toolResponse = await TOOL_MAP[toolToCall](JSON.parse(parsedContent.input));
            console.log(
                `🛠️: ${toolToCall}(${parsedContent.input}) = `,
                toolResponse
            );
            messages.push({
                role: 'developer',
                content: JSON.stringify({step: "OBSERVE", content: toolResponse}),
            });
            continue;
        }

        if(parsedContent.step === "OUTPUT"){
            console.log(parsedContent.content);
            break;
        }
    }
    console.log("🎉 Done");
}


main();