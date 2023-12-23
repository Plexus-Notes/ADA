import { Octokit } from '@octokit/rest';
import { askGPT4 } from '../../services/OpenAIService';

export async function createPullRequest(
    repoOwner: string = 'adaIsSoCool',
    repoName: string = 'ADA',
    branchName: string,
    title: string,
    body: string,
    // ALSO need to take in previous chat history so we dont just create
    // a new version of gpt 
): Promise<void | string> {
    try {
        const octokit = new Octokit({
            auth: ''
        });
        const latestCommitResponse = await octokit.rest.repos.getCommit({
            owner: repoOwner,
            repo: repoName,
            ref: 'main', // Replace with the source branch name
        });

        const latestCommitSHA = latestCommitResponse.data.sha;

        // Step 1: Create a new branch
        try {
            const response = await octokit.rest.git.createRef({
                owner: repoOwner,
                repo: repoName,
                ref: `refs/heads/${branchName}`,
                sha: latestCommitSHA
            });
        } catch (error) {
            // @ts-ignore
            console.error('Error creating ref:', error.response?.data || error.message);
        }

        // Step 2: Get the existing content of the file
        const existingFileResponse = await octokit.rest.repos.getContent({
            owner: repoOwner,
            repo: repoName,
            path: 'src/components/Chatbot.tsx',
            ref: 'main'
        });

        //@ts-ignore
        const existingFileContent = atob(existingFileResponse.data.content, 'base64');

        //@ts-ignore
        const existingFileSHA = existingFileResponse.data.sha;

        const openAIResponse = await askGPT4([
            { role: 'system', content: 'Generate an edited file.' },
            { role: 'user', content: { body } + existingFileContent },
        ], false);

        if (!openAIResponse) {
            throw new Error('OpenAI response is empty.');
        }
        // Step 3: Create a new commit with OpenAI-generated changes
        const { data } = await octokit.rest.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: repoName,
            path: 'src/components/Chatbot.tsx', // Replace with the path to your file
            message: 'Update file content',
            content: btoa(unescape(encodeURIComponent(openAIResponse))),
            branch: branchName,
            sha: existingFileSHA
        });

        // // Step 4: Create a pull request
        const PR = await octokit.rest.pulls.create({
            owner: repoOwner,
            repo: repoName,
            title,
            body,
            head: branchName,
            base: 'main',
        });

        return 'I create a PR for you. Here it is: ' + PR.data.html_url

    } catch (error) {
        console.error('Error creating pull request:', error);
        throw error;
    }
}
