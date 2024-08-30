# Use the official Node.js image.
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Declare build-time arguments
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_ANSIBLE_URL

# Set environment variables from build arguments
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NEXT_PUBLIC_ANSIBLE_URL=${NEXT_PUBLIC_ANSIBLE_URL}

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the Next.js application.
RUN npm run build

# Start the Next.js application.
CMD [ "npm", "start" ]

# Inform Docker that the container listens on the specified port at runtime.
EXPOSE 3000
