/**
 * Represents the response from Claude.
 */
export interface ClaudeResponse {
    /**
     * The query made by the user.
     */
    userQuery: string;

    /**
     * The context provided by Bedrock.
     */
    bedrock_context: string;

    /**
     * The context provided by the data.
     */
    data_context: string;

    /**
     * The error message, if any.
     */
    error: string;
}
  