# Fast Links CLI (`fl`)

Fast Links CLI is a command-line tool built using Deno that allows you to manage and quickly access predefined URLs (fast links) with optional support for variable parameters.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [Examples](#examples)
- [Variable Patterns](#variable-patterns)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Add, Replace, and Delete Fast Links**: Manage URL shortcuts for fast access.
- **Support for Variable Parameters**: Create links with placeholders to dynamically insert values using `{*}`.
- **Shorthand Commands**: Use shorthand flags for quicker CLI usage (e.g., `-a` for `--add`).
- **Shortlist Command**: Quickly display a list of all fast link names.

## Installation

### Prerequisites
- Ensure you have [Deno](https://deno.land) installed on your system.

### Clone the Repository
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/fast-links-cli.git
   ```
2. Navigate into the project directory:
   ```bash
   cd fast-links-cli
   ```

### Compile the CLI

Use Deno's `compile` command to create an executable:
```bash
deno compile --allow-read --allow-write --allow-run --output fl src/cli.ts
```

Move the binary to a directory in your system's PATH, such as `/usr/local/bin`:
```bash
sudo mv fl /usr/local/bin/
```

You can now use `fl` as a command from anywhere in your terminal.

## Usage

The CLI supports various commands to manage fast links.

### Commands

| Command               | Shorthand | Description                                         |
|-----------------------|-----------|-----------------------------------------------------|
| `fl --list`           | `-l`      | List all available fast links.                      |
| `fl --shortlist`      | `-sl`     | Show only the names of the fast links.              |
| `fl --add <name> <url> [<variableUrl>]` | `-a`    | Add a new fast link with an optional variable pattern. |
| `fl --replace <old-name> <new-name> <new-url> [<variableUrl>]` | `-r` | Edit an existing fast link. |
| `fl --delete <name>`  | `-d`      | Delete a fast link by name.                         |
| `fl --help`           | `-h`      | Show help and usage information.                    |
| `fl <name>[/query]`   |           | Open the fast link associated with the given name.  |

### Examples

#### Add a New Link
```bash
fl --add google http://www.google.com
```
Or use the shorthand:
```bash
fl -a google http://www.google.com
```

#### Add a Link with a Variable Pattern
```bash
fl --add google http://www.google.com "http://www.google.com/search?q={*}"
```
This will allow you to use `fl search/deno` to search Google for "deno."

#### List All Links
```bash
fl --list
```
Or use the shorthand:
```bash
fl -l
```

#### Show Only Fast Link Names (Shortlist)
```bash
fl --shortlist
```
Or use the shorthand:
```bash
fl -sl
```

#### Replace an Existing Link
```bash
fl --replace google google-search http://www.google.com/search?q={*}
```

#### Replace an Existing Link with a Variable Pattern
```bash
fl --replace google google-search http://www.google.com/ "http://www.google.com/search?q={*}"
```

#### Delete a Link
```bash
fl --delete google-search
```
Or use the shorthand:
```bash
fl -d google-search
```

#### Open a Fast Link
```bash
fl google
```

#### Open a Fast Link with a Variable
```bash
fl google/deno
```

## Variable Patterns

Variable patterns allow you to create dynamic URLs by including placeholders. The placeholder for variables is `{*}`, which can be substituted with a value when the link is used.

### Example Usage

1. **Add a Link with a Variable Pattern**:
   ```bash
   fl --add search http://www.google.com "http://www.google.com/search?q={*}"
   ```
   - When you call `fl search/deno`, `{*}` is replaced by "deno", resulting in:
     ```
     http://www.google.com/search?q=deno
     ```

2. **Replacing a Link to Use a Variable**:
   ```bash
   fl --replace search search http://www.bing.com "http://www.bing.com/search?q={*}"
   ```
   - Now, `fl search/openai` would redirect to:
     ```
     http://www.bing.com/search?q=openai
     ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.