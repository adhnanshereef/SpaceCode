# SpaceCode 🚀

A beautiful, modern online code compiler and IDE with professional glassmorphism design, supporting 23+ programming languages. Built as a pure vanilla web application with advanced features including auto-save, interactive input handling, and real-time code execution.

> **Developed by [Adhnan](https://www.adhnan.tech/)** - A comprehensive, professional online IDE solution

## ✨ Features

### **🎨 Beautiful Modern UI**
- **Glassmorphism Design**: Professional dark theme with gradient colors and blur effects
- **Animated Background**: Dynamic gradient background with smooth animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth hover effects and transitions throughout the interface
- **Custom Cursor Effects**: Enhanced user interaction with visual feedback

### **💾 Auto-Save System**
- **Automatic Saving**: Automatically saves your code and language selection to browser storage
- **Smart Persistence**: Restores your work when you return to the application
- **Visual Feedback**: Elegant notification panel showing save status with animations
- **Debounced Saving**: Optimized performance with 1-second delay after typing stops
- **Clear Integration**: Auto-save data is cleared when you use the Clear button

### **🌐 Multi-Language Support (23+ Languages)**
- **Compiled Languages**: C, C++, C#, Java, Go, Rust, Swift, Kotlin, Scala, Haskell
- **Interpreted Languages**: Python, JavaScript, TypeScript, PHP, Ruby, Lua, Perl, R, Julia, Dart
- **Scripting Languages**: Bash, PowerShell
- **Web Technologies**: HTML with live preview, CSS, and JavaScript execution
- **Real-time Compilation**: Uses Piston API for instant code execution

### **🔧 Advanced Code Editor**
- **Monaco Editor**: Same editor used in VS Code with full feature set
- **Syntax Highlighting**: Language-specific color coding and themes
- **Auto-completion**: Intelligent code suggestions and completions
- **Code Formatting**: Built-in code formatter with one-click formatting
- **Bracket Matching**: Automatic bracket pair colorization and matching
- **Line Numbers**: Professional line numbering with active line highlighting
- **Code Folding**: Collapsible code sections for better organization
- **Multi-cursor Support**: Advanced editing capabilities
- **Custom Theme**: Beautiful "glassMorphismDark" theme with transparent background

### **🖥️ Interactive Terminal & Output**
- **Real-time Output**: Live display of program execution results
- **Typewriter Effect**: Animated output display for enhanced user experience
- **Interactive Input**: Full support for programs requiring user input
- **Error Handling**: Comprehensive error display with formatted error messages
- **HTML Preview**: Live rendering of HTML code with CSS and JavaScript support
- **Output Download**: Save program output to text files
- **Multiple Output Types**: Support for stdout, stderr, and formatted output

### **🎯 Professional Features**
- **Fullscreen Mode**: Distraction-free coding with fullscreen editor
- **Toast Notifications**: User-friendly feedback system for all actions
- **Loading Animations**: Smooth loading states during code compilation
- **Input Handling**: Interactive input system for programs requiring user data
- **Language Templates**: Pre-loaded code examples for each supported language
- **Keyboard Shortcuts**: Full keyboard navigation and shortcuts support

### **📱 Responsive & Accessible**
- **Mobile Optimized**: Touch-friendly interface for smartphones and tablets
- **Cross-browser Compatibility**: Works on Chrome, Firefox, Safari, Edge, Opera
- **SEO Optimized**: Complete meta tags for search engines and social media
- **Google Analytics**: Integrated analytics for usage tracking
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🛠️ Technologies Used

### **Frontend Technologies**
- **HTML5**: Semantic markup with modern web standards
- **CSS3**: Advanced styling with glassmorphism effects, CSS Grid, Flexbox
- **Vanilla JavaScript (ES6+)**: Modern JavaScript with classes, async/await, and modules
- **Monaco Editor**: Microsoft's VS Code editor for web browsers

### **Styling & Design**
- **Glass Morphism**: Modern UI design trend with transparency and blur effects
- **CSS Gradients**: Beautiful color transitions and animated backgrounds
- **Backdrop Filter**: Advanced blur effects for premium look
- **CSS Animations**: Smooth transitions and interactive feedback
- **Custom CSS Variables**: Consistent theming and easy customization

### **External Services & APIs**
- **Piston API**: Code compilation and execution service (emkc.org)
- **Font Awesome 6.0**: Professional icon library
- **Google Fonts**: Inter and Fira Code typography
- **Google Analytics**: User analytics and tracking

### **Browser APIs**
- **LocalStorage**: Auto-save functionality and data persistence
- **Fetch API**: HTTP requests for code compilation
- **Blob API**: File creation and download functionality
- **Iframe API**: HTML preview and sandboxed execution

## 🚀 Getting Started

### Prerequisites
- **Modern Web Browser**: Chrome (recommended), Firefox, Safari, Edge, or Opera
- **JavaScript Enabled**: Required for full functionality
- **Internet Connection**: Needed for code compilation via Piston API
- **No Server Required**: Pure client-side application

### Quick Start
1. **Download**: Clone or download the repository
2. **Open**: Double-click `index.html` or serve via local server
3. **Code**: Select a language and start coding immediately!
4. **Run**: Click "Run" to execute your code
5. **Save**: Your work is automatically saved and restored

## 📖 Usage Examples

### **Python with Interactive Input**
```python
name = input("Enter your name: ")
age = int(input("Enter your age: "))
print(f"Hello {name}, you are {age} years old!")
```

### **Java with Scanner**
```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}
```

### **HTML with CSS & JavaScript**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { text-align: center; margin-top: 50px; }
        button { padding: 10px 20px; font-size: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>SpaceCode HTML Demo</h1>
        <button onclick="showTime()">Show Current Time</button>
        <p id="time"></p>
    </div>
    <script>
        function showTime() {
            document.getElementById('time').innerHTML = new Date().toLocaleTimeString();
        }
    </script>
</body>
</html>
```

### **C++ with Standard Library**
```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> numbers = {5, 2, 8, 1, 9};
    std::sort(numbers.begin(), numbers.end());
    
    std::cout << "Sorted numbers: ";
    for(int num : numbers) {
        std::cout << num << " ";
    }
    return 0;
}
```

## 🎨 Key Features in Detail

### **Auto-Save System**
- **Smart Detection**: Automatically detects when you're typing and saves after 1 second of inactivity
- **Visual Feedback**: Beautiful notification panel slides in from the left showing save status
- **Data Persistence**: Uses browser's localStorage to save your code and selected language
- **Seamless Restoration**: When you return, your previous work is automatically loaded
- **Clear Integration**: When you click "Clear", both editor and saved data are cleared

### **Interactive Input Handling**
- **Automatic Detection**: Recognizes when your program needs input (Python `input()`, Java `Scanner`, etc.)
- **Dynamic UI**: Input panel appears automatically when needed
- **Multi-step Support**: Handles programs requiring multiple inputs
- **Cross-language**: Works with all supported languages that require user input

### **Monaco Editor Integration**
- **VS Code Experience**: Same editor used in Visual Studio Code
- **IntelliSense**: Smart code completion and suggestions
- **Error Detection**: Real-time syntax error highlighting
- **Advanced Features**: Multi-cursor editing, find/replace, code folding
- **Custom Theme**: Glassmorphism dark theme with transparent background

### **Real-time Code Execution**
- **Piston API**: Uses Engineer Man's Piston API for code compilation
- **23+ Languages**: Supports all major programming languages
- **Error Handling**: Comprehensive error reporting with clean formatting
- **Performance**: Optimized API calls with proper timeout handling

## 🌐 Browser Compatibility

- ✅ **Chrome (recommended)**: Full feature support with optimal performance
- ✅ **Firefox**: Complete compatibility with all features
- ✅ **Safari**: Works perfectly on macOS and iOS
- ✅ **Edge**: Full support on Windows 10/11
- ✅ **Opera**: Complete functionality across all versions

## 📁 Project Structure

```
SpaceCode/
├── index.html          # Main application entry point
├── script.js           # Core JavaScript functionality
├── styles.css          # Glassmorphism styling and animations
├── logo.png           # Application logo and favicon
├── README.md          # This documentation
└── LICENSE            # MIT License file
```

## 🔧 Advanced Usage

### **Keyboard Shortcuts**
- **Ctrl+Enter**: Run code
- **Ctrl+S**: Manual save (auto-save handles this automatically)
- **F11**: Toggle fullscreen mode
- **Ctrl+F**: Find in code
- **Ctrl+H**: Find and replace
- **Shift+Alt+F**: Format code
- **Alt+Click**: Multi-cursor editing

### **Pro Tips**
- **Auto-restore**: Your work persists across browser sessions
- **Input handling**: Programs requiring input will automatically show input panel
- **HTML preview**: HTML code shows live preview instead of text output
- **Error formatting**: Errors are cleaned and formatted for better readability
- **Mobile friendly**: Fully responsive design works on all devices

## 🚀 Future Enhancements

### **Planned Features**
- **File Management**: Upload, download, and organize multiple code files
- **User Accounts**: Cloud saving with user authentication
- **Collaborative Editing**: Real-time code sharing and collaboration
- **Theme Customization**: Multiple themes and color schemes
- **Plugin System**: Extensible architecture for custom features
- **PWA Support**: Progressive Web App with offline capabilities

### **Additional Languages**
- **More Languages**: Assembly, COBOL, Fortran, Pascal, F#
- **Framework Support**: React, Vue, Angular code execution
- **Database Integration**: SQL query execution and visualization

## 🤝 Contributing

Contributions are welcome! Please feel free to:

### **How to Contribute**
- 🐛 **Report Bugs**: Submit issues with detailed reproduction steps
- 💡 **Suggest Features**: Propose new features and improvements
- 🔧 **Submit PRs**: Contribute code improvements and fixes
- 📖 **Improve Docs**: Enhance documentation and examples

### **Development Setup**
1. Fork the repository
2. Clone your fork locally
3. Make your changes
4. Test across different browsers
5. Submit a pull request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**MIT License Summary:**
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed

## 🙏 Acknowledgments

### **Technologies & Services**
- **Monaco Editor**: Microsoft's VS Code editor for the web
- **Piston API**: Code execution service by Engineer Man
- **Font Awesome**: Comprehensive icon library
- **Google Fonts**: Beautiful typography (Inter & Fira Code)

### **Inspiration**
- **VS Code**: Editor functionality and user experience
- **CodePen**: Online code editor inspiration
- **Glassmorphism Design**: Modern UI design trends

---

<div align="center">

## 👨‍💻 Developer

**Developed with ❤️ by [Adhnan](https://www.adhnan.me/)**

🌐 [Website](https://www.adhnan.me/) • 💼 [LinkedIn](https://www.linkedin.com/in/adhnanshereef) • 🐙 [GitHub](https://github.com/adhnanshereef) • 📧 [Email](mailto:contact@adhnan.me)

---

**🎉 Happy Coding with SpaceCode! 🎉**

*© 2026 Adhnan Shereef T. All rights reserved.*

</div>
