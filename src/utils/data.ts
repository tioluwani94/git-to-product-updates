export const contentTypeRegister: { [key: string]: string } = {
  features: "New features",
  bugs: "Bug fixes",
};

export const promptGenerator = (options: {
  tone?: string;
  content_type: string;
  writing_length?: string;
  product_description: string;
  tasks: { title: string; description: string }[];
}) => {
  const {
    tasks,
    content_type,
    tone = "formal",
    product_description,
    writing_length = "detailed",
  } = options;
  const featuresPrompt = `
  You are an expert product manager.
  Using an array of tasks provided in JSON format representing new features for a/an ${product_description} product, generate a ${writing_length} product update summary for each task. Each update should:

  1. Start with the task title as a heading.
  2. Follow with a ${writing_length} summary based on the task title and description, incorporating the feature's importance, how users can access it, and the benefits or improvements it brings to the system.
  3. Ensure that the language used is ${tone} and suitable for a B2B audience.
  4. Provide any relevant instructions or steps to utilize the new feature if necessary.

  For example, if the task is:
  {
    "title": "Project templates",
    "description": "You can now create standard templates for projects. You'll be able to define basic details such as the project name, description, lead, project members, project status, and associated roadmaps..."
  }
  
  The output should be:
  ## Project templates
  You can now create standard templates for projects. You'll be able to define basic details such as the project name, description, lead, project members, project status, and associated roadmaps. To create or edit a project template, go to the Templates section in your team or workspace settings. When you initiate a new project, you'll have the option to apply one of these templates from the project creation modal, in the same way you do for issue templates.

  Here's the JSON data separated by asterisks:
  ******************
  ${JSON.stringify({
    tasks,
  })}
  ******************    
`;

  const bugsPrompt = `
  You are an expert product manager.
  Using an array of tasks provided in JSON format representing bug fixes for a/an ${product_description} product, generate a summarized bug fix description for each task. Each update should:

  1. Follow with a concise summary of the fixed bug based on the task title and description.
  2. Ensure that the language used is ${tone} and suitable for a B2B audience.

  For example, if the task is:
  {
    "title": "Exception when using time actions while in CEST timezone.",
    "description": "Users are getting an exception error wehn using time actions while in CEST timezone."
  }
  
  The output should be:
  Fixed a bug that would cause an exception when using time actions while in CEST timezone.

  Here's the JSON data separated by asterisks:
  ******************
  ${JSON.stringify({
    tasks,
  })}
  ******************    
`;

  const promptsRegister: { [key: string]: string } = {
    bugs: bugsPrompt,
    features: featuresPrompt,
  };

  return promptsRegister[content_type];
};

export const TONES = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "helpful", label: "Helpful" },
];

export const WRITING_LENGTH = [
  { value: "balanced", label: "Balanced" },
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
];
