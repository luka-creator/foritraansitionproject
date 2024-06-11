// index.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/create-jira-ticket', async (req, res) => {
  const { summary, description, priority } = req.body;

  try {
    const response = await axios.post(
      `https://${process.env.REACT_APP_JIRA_DOMAIN}/rest/api/3/issue`,
      {
        fields: {
          project: {
            key: process.env.REACT_APP_JIRA_PROJECT_KEY
          },
          summary,
          description,
          issuetype: {
            name: 'Task'
          },
          priority: {
            name: priority
          }
        }
      },
      {
        auth: {
          username: process.env.REACT_APP_JIRA_EMAIL,
          password: process.env.REACT_APP_JIRA_API_TOKEN
        }
      }
    );

    res.status(201).json({ message: 'Ticket created successfully', ticket: response.data });
  } catch (error) {
    console.error('Error creating Jira ticket:', error);
    res.status(500).json({ message: 'Failed to create Jira ticket' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
