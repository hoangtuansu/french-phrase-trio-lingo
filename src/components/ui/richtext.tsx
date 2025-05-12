import { useCallback } from "react";
import { Editor, Transforms, Text, Element as SlateElement } from "slate";
import { Editable } from "slate-react";
import { IconButton, Divider } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Title,
  LooksOne,
  LooksTwo,
  Clear
} from "@mui/icons-material";
// Define element renderers
const BlockQuote = (props) => {
  return <blockquote 
    style={{ 
      borderLeft: '4px solid #ccc', 
      paddingLeft: '16px',
      color: '#666',
      fontStyle: 'italic' 
    }} 
    {...props.attributes}
  >
    {props.children}
  </blockquote>;
};
const CodeElement = (props) => {
  return <pre 
    style={{ 
      backgroundColor: '#f5f5f5', 
      padding: '8px',
      borderRadius: '4px',
      fontFamily: 'monospace' 
    }} 
    {...props.attributes}
  >
    <code>{props.children}</code>
  </pre>;
};
const HeadingOneElement = (props) => {
  return <h1 {...props.attributes}>{props.children}</h1>;
};
const HeadingTwoElement = (props) => {
  return <h2 {...props.attributes}>{props.children}</h2>;
};
const BulletedListElement = (props) => {
  return <ul {...props.attributes}>{props.children}</ul>;
};
const NumberedListElement = (props) => {
  return <ol {...props.attributes}>{props.children}</ol>;
};
const ListItemElement = (props) => {
  return <li {...props.attributes}>{props.children}</li>;
};
const DefaultElement = (props) => {
  return <p style={{ margin: '0' }} {...props.attributes}>{props.children}</p>;
};
const Leaf = (props) => {
  let { leaf, attributes, children } = props;
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.code) {
    children = <code style={{ backgroundColor: '#f0f0f0', padding: '2px 4px', borderRadius: '3px' }}>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};
function RichTextEditor({ editor }) {
  // Function to clear editor content
  const clearContent = () => {
    // Create a single empty paragraph node
    const emptyNode = {
      type: 'paragraph',
      children: [{ text: '' }],
    };
    
    // Reset editor with just that empty paragraph
    editor.children = [emptyNode];
    editor.onChange();
    
    // Move selection to the start
    Transforms.select(editor, {
      path: [0, 0],
      offset: 0,
    });
  };
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "quote":
        return <BlockQuote {...props} />;
      case "heading-one":
        return <HeadingOneElement {...props} />;
      case "heading-two":
        return <HeadingTwoElement {...props} />;
      case "bulleted-list":
        return <BulletedListElement {...props} />;
      case "numbered-list":
        return <NumberedListElement {...props} />;
      case "list-item":
        return <ListItemElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  // Toggle marks (bold, italic, etc.)
  function toggleMark(mark) {
    const isActive = isMarkActive(editor, mark);
    
    if (isActive) {
      Editor.removeMark(editor, mark);
    } else {
      Editor.addMark(editor, mark, true);
    }
  }
  // Check if a mark is active
  const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
  };
  // Toggle blocks (headings, lists, etc.)
  function toggleBlock(format) {
    const isActive = isBlockActive(editor, format);
    const isList = ['numbered-list', 'bulleted-list'].includes(format);
    // Unwrap any existing lists if toggling them off or changing types
    Transforms.unwrapNodes(editor, {
      match: n => 
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        ['bulleted-list', 'numbered-list'].includes(n.type),
      split: true,
    });
    // Set the appropriate node type
    const newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
    
    Transforms.setNodes(editor, newProperties);
    // If turning on a list type, wrap in the appropriate list element
    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  }
  // Check if a block type is active
  const isBlockActive = (editor, format) => {
    const { selection } = editor;
    if (!selection) return false;
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n => 
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === format,
      })
    );
    return !!match;
  };
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);
  // Handle keyboard shortcuts
  const onKeyDown = (event) => {
    if (!event.ctrlKey) {
      return;
    }
    event.preventDefault();
    switch (event.key) {
      case "b": {
        toggleMark("bold");
        break;
      }
      case "i": {
        toggleMark("italic");
        break;
      }
      case "u": {
        toggleMark("underline");
        break;
      }
      case "`": {
        toggleMark("code");
        break;
      }
      case "1": {
        toggleBlock("heading-one");
        break;
      }
      case "2": {
        toggleBlock("heading-two");
        break;
      }
      default: {
        break;
      }
    }
  };
  return (
    <div
      style={{
        textAlign: "start",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "4px"
      }}
    >
      {/* Text formatting toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginBottom: '8px' }}>
        <IconButton
          size="small"
          style={{ color: isMarkActive(editor, "bold") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("bold");
          }}
          title="Bold (Ctrl+B)"
        >
          <FormatBold />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isMarkActive(editor, "italic") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("italic");
          }}
          title="Italic (Ctrl+I)"
        >
          <FormatItalic />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isMarkActive(editor, "underline") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("underline");
          }}
          title="Underline (Ctrl+U)"
        >
          <FormatUnderlined />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isMarkActive(editor, "code") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark("code");
          }}
          title="Inline Code (Ctrl+`)"
        >
          <Code />
        </IconButton>
        
        <Divider orientation="vertical" flexItem style={{ margin: '0 8px' }} />
        
        {/* Block formatting buttons */}
        <IconButton
          size="small"
          style={{ color: isBlockActive(editor, "heading-one") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("heading-one");
          }}
          title="Heading 1 (Ctrl+1)"
        >
          <LooksOne />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isBlockActive(editor, "heading-two") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("heading-two");
          }}
          title="Heading 2 (Ctrl+2)"
        >
          <LooksTwo />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isBlockActive(editor, "quote") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("quote");
          }}
          title="Block Quote"
        >
          <FormatQuote />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isBlockActive(editor, "bulleted-list") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("bulleted-list");
          }}
          title="Bulleted List"
        >
          <FormatListBulleted />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isBlockActive(editor, "numbered-list") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("numbered-list");
          }}
          title="Numbered List"
        >
          <FormatListNumbered />
        </IconButton>
        <IconButton
          size="small"
          style={{ color: isBlockActive(editor, "code") ? "#1976d2" : "grey" }}
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock("code");
          }}
          title="Code Block"
        >
          <Code fontSize="small" />
        </IconButton>
        
        {/* Clear button - now positioned next to other controls but with red color */}
        <IconButton
          size="small"
          style={{ 
            color: "#f44336",
            marginLeft: '2px'
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            if (window.confirm('Are you sure you want to clear all content?')) {
              clearContent();
            }
          }}
          title="Clear All Content"
        >
          <Clear />
        </IconButton>
      </div>
      
      {/* Editor area */}
      <Editable
        style={{
          minHeight: "200px",
          maxHeight: "500px",
          overflowY: "auto",
          padding: "8px",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          lineHeight: "1.5",
          // Fix for placeholder alignment
          position: "relative",
          caretColor: "black",
        }}
        onKeyDown={onKeyDown}
        renderLeaf={renderLeaf}
        renderElement={renderElement}
        placeholder="Start typing..."
        spellCheck
        decorate={([node, path]) => {
          // Correct placeholder vertical alignment with CSS
          if (Text.isText(node) && node.text === '') {
            const styles = document.createElement('style');
            styles.innerHTML = `
              [data-slate-editor] [data-slate-placeholder="true"] {
                position: absolute;
                display: inline-block;
                top: 8px !important;
                pointer-events: none;
                user-select: none;
                height: 0;
                color: #aaa;
              }
            `;
            if (!document.head.contains(styles)) {
              document.head.appendChild(styles);
            }
          }
          return [];
        }}
      />
    </div>
  );
}
export { RichTextEditor };