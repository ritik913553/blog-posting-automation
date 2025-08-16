import axios from "axios";

/**
 * Publishes a post to Hashnode
 * @param {string} token - Your Hashnode Personal Access Token
 * @param {object} input - The PublishPostInput object
 */
async function publishPost(token, input) {
    const query = `
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          title
          url
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            "https://gql.hashnode.com",
            {
                query,
                variables: { input },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }
        );

        if (response.data.errors) {
            console.error("❌ Error:", response.data.errors);
            return null;
        }

        return response.data.data.publishPost.post;
    } catch (error) {
        console.error(
            "❌ Request failed:",
            error.response?.data || error.message
        );
        return null;
    }
}

export { publishPost };
