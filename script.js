class SpaceCode {  constructor() {
    this.editor = null;
    this.initializeElements();
    this.initializeMonacoEditor();
    this.setupEventListeners();
    this.setupAutoSave();
  }

  initializeElements() {
    this.languageSelect = document.getElementById("languageSelect");
    this.output = document.getElementById("output");
    this.htmlPreview = document.getElementById("htmlPreview");
    this.htmlFrame = document.getElementById("htmlFrame");
    this.runBtn = document.getElementById("runBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.clearOutputBtn = document.getElementById("clearOutputBtn");
    this.formatBtn = document.getElementById("formatBtn");
    this.fullscreenBtn = document.getElementById("fullscreenBtn");
    this.downloadOutputBtn = document.getElementById("downloadOutputBtn");
    this.loadingOverlay = document.getElementById("loadingOverlay");
    this.toastContainer = document.getElementById("toastContainer");    this.inputContainer = document.getElementById("inputContainer");
    this.userInput = document.getElementById("userInput");
    this.sendInputBtn = document.getElementById("sendInputBtn");
    this.autoSavePanel = document.getElementById("autoSavePanel");
    this.autoSaveIndicator = document.getElementById("autoSaveIndicator");// Input handling state
    this.isWaitingForInput = false;
    this.currentInputResolver = null;
    this.programOutput = "";
    
    // Auto-save state
    this.autoSaveKey = "spacecode-autosave";
    this.autoSaveEnabled = true;
    this.saveTimeout = null;
  }

  async initializeMonacoEditor() {
    // Configure Monaco Editor loader
    require.config({
      paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs",
      },
    });

    // Load Monaco Editor
    require(["vs/editor/editor.main"], () => {
      // Define custom dark theme
      monaco.editor.defineTheme("glassMorphismDark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
          { token: "keyword", foreground: "569CD6", fontStyle: "bold" },
          { token: "string", foreground: "CE9178" },
          { token: "number", foreground: "B5CEA8" },
          { token: "regexp", foreground: "D16969" },
          { token: "type", foreground: "4EC9B0" },
          { token: "class", foreground: "4EC9B0" },
          { token: "function", foreground: "DCDCAA" },
          { token: "variable", foreground: "9CDCFE" },
          { token: "constant", foreground: "4FC1FF" },
          { token: "property", foreground: "9CDCFE" },
          { token: "operator", foreground: "D4D4D4" },
          { token: "delimiter", foreground: "D4D4D4" },
          { token: "tag", foreground: "569CD6" },
          { token: "attribute.name", foreground: "9CDCFE" },
          { token: "attribute.value", foreground: "CE9178" },
        ],
        colors: {
          "editor.background": "#00000000",
          "editor.foreground": "#ffffff",
          "editor.lineHighlightBackground": "#ffffff0d",
          "editor.selectionBackground": "#667eea4d",
          "editor.selectionHighlightBackground": "#667eea26",
          "editor.findMatchBackground": "#667eea4d",
          "editor.findMatchHighlightBackground": "#667eea26",
          "editorCursor.foreground": "#ffffff",
          "editorLineNumber.foreground": "#8892b0",
          "editorLineNumber.activeForeground": "#b8c4e0",
          "editorIndentGuide.background": "#ffffff1a",
          "editorIndentGuide.activeBackground": "#ffffff33",
          "editorBracketMatch.background": "#667eea33",
          "editorBracketMatch.border": "#667eea",
          "scrollbar.shadow": "#00000000",
          "scrollbarSlider.background": "#ffffff33",
          "scrollbarSlider.hoverBackground": "#ffffff4d",
          "scrollbarSlider.activeBackground": "#ffffff66",
        },
      });

      // Create the editor
      const editorContainer = document.getElementById("monacoEditor");
      if (!editorContainer) {
        console.error("Monaco Editor container not found");
        return;
      }

      this.editor = monaco.editor.create(editorContainer, {
        value: "",
        language: "python",
        theme: "glassMorphismDark",
        fontSize: 15,
        fontFamily: "Fira Code, Monaco, Cascadia Code, monospace",
        fontLigatures: true,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        minimap: { enabled: false },
        scrollbar: {
          vertical: "auto",
          horizontal: "auto",
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        wordWrap: "off",
        contextmenu: true,
        mouseWheelZoom: true,
        cursorBlinking: "smooth",
        cursorSmoothCaretAnimation: true,
        smoothScrolling: true,
        selectOnLineNumbers: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        glyphMargin: false,
        folding: true,
        foldingStrategy: "indentation",
        showFoldingControls: "mouseover",
        unfoldOnClickAfterEndOfLine: false,
        dragAndDrop: true,
        formatOnPaste: true,
        formatOnType: true,
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        tabCompletion: "on",
        wordBasedSuggestions: true,
        parameterHints: { enabled: true },
        autoIndent: "full",
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
      });      // Load default code after editor is ready
      this.loadDefaultCode();
      
      // Setup auto-save listeners for Monaco Editor
      this.setupEditorAutoSave();
    });
  }

  setupEventListeners() {
    this.runBtn.addEventListener("click", () => this.runCode());
    this.clearBtn.addEventListener("click", () => this.clearEditor());
    this.clearOutputBtn.addEventListener("click", () => this.clearOutput());
    this.formatBtn.addEventListener("click", () => this.formatCode());
    this.fullscreenBtn.addEventListener("click", () => this.toggleFullscreen());
    this.downloadOutputBtn.addEventListener("click", () =>
      this.downloadOutput()
    );
    this.languageSelect.addEventListener("change", () => this.changeLanguage());

    // Input handling
    this.sendInputBtn.addEventListener("click", () => this.sendInput());
    this.userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendInput();
      }
    });
  }

  sendInput() {
    if (this.isWaitingForInput && this.currentInputResolver) {
      const input = this.userInput.value;
      this.userInput.value = "";
      this.hideInputContainer();
      this.currentInputResolver(input);
    }
  }

  showInputContainer(prompt = "") {
    this.inputContainer.style.display = "flex";
    this.userInput.placeholder = prompt || "Enter input...";
    this.userInput.focus();
    this.isWaitingForInput = true;
  }

  hideInputContainer() {
    this.inputContainer.style.display = "none";
    this.isWaitingForInput = false;
  }

  waitForInput(prompt = "Program is waiting for input:") {
    return new Promise((resolve) => {
      this.currentInputResolver = resolve;
      this.showInputContainer(prompt);
    });
  }
  changeLanguage() {
    const language = this.languageSelect.value;
    const monacoLanguageMap = {
      python: "python",
      cpp: "cpp",
      c: "c",
      java: "java",
      javascript: "javascript",
      csharp: "csharp",
      go: "go",
      rust: "rust",
      php: "php",
      ruby: "ruby",
      swift: "swift",
      kotlin: "kotlin",
      scala: "scala",
      typescript: "typescript",
      lua: "lua",
      perl: "perl",
      r: "r",
      dart: "dart",
      haskell: "haskell",
      julia: "julia",
      bash: "shell",
      powershell: "powershell",
      html: "html",
    };

    if (this.editor) {
      const monacoLang = monacoLanguageMap[language] || "plaintext";
      monaco.editor.setModelLanguage(this.editor.getModel(), monacoLang);
      
      // Only load default code if no auto-saved data exists or editor is empty
      const currentCode = this.editor.getValue().trim();
      if (!currentCode) {
        this.loadDefaultCode();
      }
      
      // Trigger auto-save when language changes
      this.debouncedSave();
    }
  }
  loadDefaultCode() {
    // Check if we have auto-saved data and should skip loading default code
    try {
      const savedData = localStorage.getItem(this.autoSaveKey);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.code && data.code.trim()) {
          // Don't load default code if we have saved code
          return;
        }
      }
    } catch (error) {
      // Continue with default code if auto-save check fails
    }

    const language = this.languageSelect.value;
    const defaultCodes = {
      python: `# Welcome to Python!
print("Hello, World!")

# Example with input
name = input("Enter your name: ")
print(f"Hello, {name}!")

# Simple calculation
numbers = [1, 2, 3, 4, 5]
print(f"Sum: {sum(numbers)}")`,

      javascript: `// Welcome to JavaScript!
console.log("Hello, World!");

// Example functions
function greet(name) {
    return \`Hello, \${name}!\`;
}

const message = greet("JavaScript");
console.log(message);`,

      java: `// Welcome to Java!
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // Example with Scanner
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        
        // Simple calculation
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = Arrays.stream(numbers).sum();
        System.out.println("Sum: " + sum);
    }
}`,

      cpp: `// Welcome to C++!
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // Example with input
    string name;
    cout << "Enter your name: ";
    getline(cin, name);
    cout << "Hello, " << name << "!" << endl;
    
    // Simple calculation
    int numbers[] = {1, 2, 3, 4, 5};
    int sum = 0;
    for(int i = 0; i < 5; i++) {
        sum += numbers[i];
    }
    cout << "Sum: " << sum << endl;
    
    return 0;
}`,

      c: `// Welcome to C!
#include <stdio.h>
#include <string.h>

int main() {
    printf("Hello, World!\\n");
    
    // Example with input
    char name[100];
    printf("Enter your name: ");
    fgets(name, sizeof(name), stdin);
    name[strcspn(name, "\\n")] = 0; // Remove newline
    printf("Hello, %s!\\n", name);
    
    // Simple calculation
    int numbers[] = {1, 2, 3, 4, 5};
    int sum = 0;
    for(int i = 0; i < 5; i++) {
        sum += numbers[i];
    }
    printf("Sum: %d\\n", sum);
    
    return 0;
}`,

      csharp: `// Welcome to C#!
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        // Example with input
        Console.Write("Enter your name: ");
        string name = Console.ReadLine();
        Console.WriteLine($"Hello, {name}!");
        
        // Simple calculation
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        foreach(int num in numbers) {
            sum += num;
        }
        Console.WriteLine($"Sum: {sum}");
    }
}`,

      go: `// Welcome to Go!
package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    fmt.Println("Hello, World!")
    
    // Example with input
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter your name: ")
    name, _ := reader.ReadString('\\n')
    name = name[:len(name)-1] // Remove newline
    fmt.Printf("Hello, %s!\\n", name)
    
    // Simple calculation
    numbers := []int{1, 2, 3, 4, 5}
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    fmt.Printf("Sum: %d\\n", sum)
}`,

      rust: `// Welcome to Rust!
use std::io;

fn main() {
    println!("Hello, World!");
    
    // Example with input
    println!("Enter your name: ");
    let mut name = String::new();
    io::stdin().read_line(&mut name).expect("Failed to read line");
    let name = name.trim();
    println!("Hello, {}!", name);
    
    // Simple calculation
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}`,

      php: `<?php
// Welcome to PHP!
echo "Hello, World!\\n";

// Example with input
echo "Enter your name: ";
$name = trim(fgets(STDIN));
echo "Hello, $name!\\n";

// Simple calculation
$numbers = [1, 2, 3, 4, 5];
$sum = array_sum($numbers);
echo "Sum: $sum\\n";
?>`,

      ruby: `# Welcome to Ruby!
puts "Hello, World!"

# Example with input
print "Enter your name: "
name = gets.chomp
puts "Hello, \#{name}!"

# Simple calculation
numbers = [1, 2, 3, 4, 5]
sum = numbers.sum
puts "Sum: \#{sum}"`,

      swift: `// Welcome to Swift!
import Foundation

print("Hello, World!")

// Example with input
print("Enter your name: ", terminator: "")
if let name = readLine() {
    print("Hello, \\(name)!")
}

// Simple calculation
let numbers = [1, 2, 3, 4, 5]
let sum = numbers.reduce(0, +)
print("Sum: \\(sum)")`,

      kotlin: `// Welcome to Kotlin!
fun main() {
    println("Hello, World!")
    
    // Example with input
    print("Enter your name: ")
    val name = readLine() ?: ""
    println("Hello, $name!")
    
    // Simple calculation
    val numbers = listOf(1, 2, 3, 4, 5)
    val sum = numbers.sum()
    println("Sum: $sum")
}`,

      scala: `// Welcome to Scala!
import scala.io.StdIn

object Main extends App {
    println("Hello, World!")
    
    // Example with input
    print("Enter your name: ")
    val name = StdIn.readLine()
    println(s"Hello, $name!")
    
    // Simple calculation
    val numbers = List(1, 2, 3, 4, 5)
    val sum = numbers.sum
    println(s"Sum: $sum")
}`,

      typescript: `// Welcome to TypeScript!
console.log("Hello, World!");

function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

const message: string = greet("TypeScript");
console.log(message);

// Simple calculation
const numbers: number[] = [1, 2, 3, 4, 5];
const sum: number = numbers.reduce((a, b) => a + b, 0);
console.log(\`Sum: \${sum}\`);`,

      lua: `-- Welcome to Lua!
print("Hello, World!")

-- Example with input
io.write("Enter your name: ")
local name = io.read()
print("Hello, " .. name .. "!")

-- Simple calculation
local numbers = {1, 2, 3, 4, 5}
local sum = 0
for i = 1, #numbers do
    sum = sum + numbers[i]
end
print("Sum: " .. sum)`,

      perl: `# Welcome to Perl!
print "Hello, World!\\n";

# Example with input
print "Enter your name: ";
chomp(my $name = <STDIN>);
print "Hello, $name!\\n";

# Simple calculation
my @numbers = (1, 2, 3, 4, 5);
my $sum = 0;
$sum += $_ for @numbers;
print "Sum: $sum\\n";`,

      r: `# Welcome to R!
print("Hello, World!")

# Example with input
cat("Enter your name: ")
name <- readLines("stdin", n=1)
cat("Hello,", name, "!\\n")

# Simple calculation
numbers <- c(1, 2, 3, 4, 5)
total <- sum(numbers)
cat("Sum:", total, "\\n")`,

      dart: `// Welcome to Dart!
import 'dart:io';

void main() {
    print('Hello, World!');
    
    // Example with input
    stdout.write('Enter your name: ');
    String? name = stdin.readLineSync();
    print('Hello, $name!');
    
    // Simple calculation
    List<int> numbers = [1, 2, 3, 4, 5];
    int sum = numbers.reduce((a, b) => a + b);
    print('Sum: $sum');
}`,

      haskell: `-- Welcome to Haskell!
main :: IO ()
main = do
    putStrLn "Hello, World!"
    
    -- Example with input
    putStr "Enter your name: "
    name <- getLine
    putStrLn $ "Hello, " ++ name ++ "!"
    
    -- Simple calculation
    let numbers = [1, 2, 3, 4, 5]
    let total = sum numbers
    putStrLn $ "Sum: " ++ show total`,

      julia: `# Welcome to Julia!
println("Hello, World!")

# Example with input
print("Enter your name: ")
name = readline()
println("Hello, $name!")

# Simple calculation
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
println("Sum: $total")`,

      bash: `#!/bin/bash
# Welcome to Bash!
echo "Hello, World!"

# Example with input
echo -n "Enter your name: "
read name
echo "Hello, $name!"

# Simple calculation
numbers=(1 2 3 4 5)
sum=0
for num in "\${numbers[@]}"; do
    sum=$((sum + num))
done
echo "Sum: $sum"`,

      powershell: `# Welcome to PowerShell!
Write-Host "Hello, World!"

# Example with input
$name = Read-Host "Enter your name"
Write-Host "Hello, $name!"

# Simple calculation
$numbers = @(1, 2, 3, 4, 5)
$sum = ($numbers | Measure-Object -Sum).Sum
Write-Host "Sum: $sum"`,

      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 10px;
        }
        button:hover {
            background: #764ba2;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, World!</h1>
        <p>Welcome to HTML with CSS and JavaScript!</p>
        <button onclick="showAlert()">Click Me!</button>
        <button onclick="changeColor()">Change Color</button>
        <div id="output"></div>
    </div>

    <script>
        function showAlert() {
            document.getElementById('output').innerHTML = '<p>Hello from JavaScript!</p>';
        }
        
        function changeColor() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.style.background = \`linear-gradient(135deg, \${randomColor} 0%, #764ba2 100%)\`;
        }
    </script>
</body>
</html>`,
    };

    if (this.editor) {
      this.editor.setValue(
        defaultCodes[language] ||
          '// Code template not available for this language\\nconsole.log("Hello, World!");'
      );
    }
    this.clearOutput();
  }

  async runCode() {
    const language = this.languageSelect.value;
    const code = this.editor ? this.editor.getValue().trim() : "";

    if (!code) {
      this.showToast("Please enter some code to run!", "error");
      return;
    }

    this.showLoading(true);
    this.clearOutput();

    try {
      if (language === "html") {
        this.runHTML(code);
      } else {
        await this.compileAndRun(language, code);
      }
    } catch (error) {
      this.displayOutput("Error: " + error.message, "error");
    }

    this.showLoading(false);
  }

  runHTML(code) {
    // Hide regular output and show HTML preview
    this.output.style.display = "none";
    this.htmlPreview.style.display = "block";

    // Create a blob URL for the HTML content
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    this.htmlFrame.src = url;
    this.showToast("HTML rendered successfully!", "success");
  }
  async compileAndRun(language, code) {
    // Hide HTML preview and show regular output
    this.htmlPreview.style.display = "none";
    this.output.style.display = "block";
    this.hideInputContainer();

    try {
      // First, try to run without input
      let result = await this.executeCode(language, code);

      // Check if the program needs input (common patterns)
      if (this.needsInput(result, code)) {
        // Hide loading screen before showing input
        this.showLoading(false);

        // Show current output with any prompt message
        const currentOutput = result.run.stdout || result.run.output || "";
        if (currentOutput.trim()) {
          this.displayOutput(currentOutput, "info");
        }

        // Wait for user input with the actual prompt message
        const inputPrompt =
          currentOutput.trim() || "Enter input for your program:";
        const userInput = await this.waitForInput(inputPrompt);

        // Show loading again for the second execution
        this.showLoading(true);

        // Re-run with input
        result = await this.executeCode(language, code, userInput);
      }

      if (result.run.code === 0) {
        const finalOutput =
          result.run.output ||
          result.run.stdout ||
          "Program executed successfully";
        this.displayOutput(finalOutput, "success");
        this.showToast("Code executed successfully!", "success");
      } else {
        const errorOutput = this.formatError(
          result.run.stderr || result.run.output
        );
        this.displayOutput(errorOutput, "error");
        this.showToast("Execution completed with errors", "error");
      }
    } catch (error) {
      this.displayOutput(
        "Network Error: " +
          error.message +
          "\\nPlease check your internet connection and try again.",
        "error"
      );
      this.showToast("Failed to execute code", "error");
    }
  }
  needsInput(result, code) {
    const inputPatterns = {
      python: /input\s*\(/,
      java: /Scanner|System\.in|BufferedReader/,
      cpp: /cin\s*>>|getline|scanf/,
      c: /scanf|getchar|gets/,
      javascript: /prompt\s*\(/,
      csharp: /Console\.ReadLine|Console\.Read/,
      go: /fmt\.Scan|bufio\.NewReader/,
      rust: /std::io::stdin|read_line/,
      php: /fgets|readline|trim\(fgets/,
      ruby: /gets|STDIN\.gets/,
      swift: /readLine/,
      kotlin: /readLine/,
      scala: /readLine|StdIn\.read/,
      typescript: /prompt\s*\(/,
      lua: /io\.read/,
      perl: /<STDIN>|readline/,
      r: /readline|scan/,
      dart: /stdin\.readLineSync/,
      haskell: /getLine/,
      julia: /readline/,
      bash: /read\s/,
      powershell: /Read-Host/,
    };

    const language = this.languageSelect.value;
    const hasInputCode =
      inputPatterns[language] && inputPatterns[language].test(code);
    const hasPromptOutput =
      result.run.stdout && result.run.stdout.trim().length > 0;

    return hasInputCode && hasPromptOutput && result.run.code === 0;
  }

  async executeCode(language, code, stdin = "") {
    const languageMap = {
      python: "python",
      cpp: "c++",
      c: "c",
      java: "java",
      javascript: "javascript",
      csharp: "csharp",
      go: "go",
      rust: "rust",
      php: "php",
      ruby: "ruby",
      swift: "swift",
      kotlin: "kt",
      scala: "scala",
      typescript: "typescript",
      lua: "lua",
      perl: "perl",
      r: "rscript",
      dart: "dart",
      haskell: "haskell",
      julia: "julia",
      bash: "bash",
      powershell: "powershell",
    };

    const fileExtensionMap = {
      python: "py",
      cpp: "cpp",
      c: "c",
      java: "java",
      javascript: "js",
      csharp: "cs",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      swift: "swift",
      kotlin: "kt",
      scala: "scala",
      typescript: "ts",
      lua: "lua",
      perl: "pl",
      r: "r",
      dart: "dart",
      haskell: "hs",
      julia: "jl",
      bash: "sh",
      powershell: "ps1",
    };

    const pistonLanguage = languageMap[language] || language;
    const fileExtension = fileExtensionMap[language] || "txt";
    const fileName = "main." + fileExtension;

    const requestBody = {
      language: pistonLanguage,
      version: "*",
      files: [
        {
          name: fileName,
          content: code,
        },
      ],
      stdin: stdin,
      args: [],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_cpu_time: 10000,
      run_cpu_time: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    };

    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    return await response.json();
  }
  formatError(errorText) {
    if (!errorText) return "Unknown error occurred";

    let cleanError = errorText
      .replace(/\/piston\/jobs\/[^\/]+\/[^"'\s,]+/g, "")
      .replace(/File\s+"[^"]+",?\s*/g, "")
      .replace(/^\s*\n/gm, "")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    return cleanError || "Error occurred during execution";
  }

  displayOutput(text, type = "success") {
    this.output.innerHTML = "";
    this.output.className = "output-content " + type;
    this.programOutput = text;
    this.typeWriter(text, 0);
  }

  appendToOutput(text) {
    this.programOutput += text;
    this.output.textContent += text;
    this.output.scrollTop = this.output.scrollHeight;
  }

  typeWriter(text, index) {
    if (index < text.length) {
      this.output.textContent += text.charAt(index);
      setTimeout(() => this.typeWriter(text, index + 1), 10);
    }
    this.output.scrollTop = this.output.scrollHeight;
  }  clearEditor() {
    if (this.editor) {
      this.editor.setValue("");
    }
    
    // Clear auto-saved data when user explicitly clears the editor
    this.clearAutoSave();
    this.hideAutoSaveIndicator();
    
    this.showToast("Editor cleared and auto-save deleted", "info");
  }

  clearOutput() {
    this.output.innerHTML = "";
    this.output.className = "output-content";
    this.programOutput = "";
    this.showToast("Output cleared", "info");
  }

  formatCode() {
    if (this.editor) {
      this.editor.getAction("editor.action.formatDocument").run();
      this.showToast("Code formatted", "success");
    }
  }

  toggleFullscreen() {
    const editorPanel = document.querySelector(".editor-panel");
    editorPanel.classList.toggle("fullscreen");

    if (editorPanel.classList.contains("fullscreen")) {
      this.showToast("Fullscreen mode enabled", "info");
    } else {
      this.showToast("Fullscreen mode disabled", "info");
    }

    // Trigger layout update for Monaco Editor
    setTimeout(() => {
      if (this.editor) {
        this.editor.layout();
      }
    }, 100);
  }

  downloadOutput() {
    const blob = new Blob([this.programOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast("Output downloaded", "success");
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    this.toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 3000);
  }
  showLoading(show) {
    this.loadingOverlay.style.display = show ? "flex" : "none";
  }
  showAutoSaveIndicator() {
    if (!this.autoSaveIndicator) return;
    
    // Show saving state
    this.autoSaveIndicator.classList.add('saving');
    this.autoSaveIndicator.classList.add('show');
    this.autoSaveIndicator.innerHTML = '<i class="fas fa-sync-alt"></i><span>Saving...</span>';
    
    // After a short delay, show saved state
    setTimeout(() => {
      this.autoSaveIndicator.classList.remove('saving');
      this.autoSaveIndicator.innerHTML = '<i class="fas fa-check-circle"></i><span>Auto-saved</span>';
      
      // Hide after 4 seconds (slightly longer for better UX)
      setTimeout(() => {
        this.autoSaveIndicator.classList.remove('show');
      }, 4000);
    }, 800);
  }

  hideAutoSaveIndicator() {
    if (this.autoSaveIndicator) {
      this.autoSaveIndicator.classList.remove('show', 'saving');
    }
  }

  // Auto-save functionality
  setupAutoSave() {
    // Load saved data on initialization
    this.loadFromAutoSave();
  }
  saveToAutoSave() {
    if (!this.autoSaveEnabled || !this.editor) return;

    const saveData = {
      language: this.languageSelect.value,
      code: this.editor.getValue(),
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(this.autoSaveKey, JSON.stringify(saveData));
      this.showAutoSaveIndicator();
    } catch (error) {
      console.warn("Auto-save failed:", error);
    }
  }

  loadFromAutoSave() {
    try {
      const savedData = localStorage.getItem(this.autoSaveKey);
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Set the language first
        if (data.language) {
          this.languageSelect.value = data.language;
        }
        
        // Set the code when editor is ready
        if (data.code && this.editor) {
          this.editor.setValue(data.code);
        } else if (data.code) {
          // If editor is not ready yet, wait for it
          const waitForEditor = () => {
            if (this.editor) {
              this.editor.setValue(data.code);
              this.changeLanguage(); // Update syntax highlighting
            } else {
              setTimeout(waitForEditor, 100);
            }
          };
          waitForEditor();
        }
        
        this.showToast("Previous work restored!", "info");
      }
    } catch (error) {
      console.warn("Failed to load auto-save:", error);
    }
  }

  clearAutoSave() {
    try {
      localStorage.removeItem(this.autoSaveKey);
    } catch (error) {
      console.warn("Failed to clear auto-save:", error);
    }
  }

  debouncedSave() {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // Set new timeout to save after 1 second of inactivity
    this.saveTimeout = setTimeout(() => {
      this.saveToAutoSave();
    }, 1000);
  }

  setupEditorAutoSave() {
    if (!this.editor) return;
    
    // Listen for content changes in Monaco Editor
    this.editor.onDidChangeModelContent(() => {
      this.debouncedSave();
    });
  }
}

// CSS for fullscreen mode
const fullscreenStyles = `
.editor-panel.fullscreen {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
    background: var(--glass-bg) !important;
    backdrop-filter: blur(20px) !important;
    border-radius: 0 !important;
    max-width: none !important;
    flex: none !important;
}

.editor-panel.fullscreen .editor-container {
    height: calc(100vh - 80px) !important;
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = fullscreenStyles;
document.head.appendChild(styleSheet);

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new SpaceCode();

  // Add cursor effect
  document.addEventListener("mousemove", (e) => {
    const cursor = document.querySelector(".cursor-effect");
    if (!cursor) {
      const cursorDiv = document.createElement("div");
      cursorDiv.className = "cursor-effect";
      cursorDiv.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
      document.body.appendChild(cursorDiv);
    }

    const cursorEffect = document.querySelector(".cursor-effect");
    if (cursorEffect) {      cursorEffect.style.left = e.clientX - 10 + "px";
      cursorEffect.style.top = e.clientY - 10 + "px";
    }
  });
});
