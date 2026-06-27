import { useEffect, useMemo, useState } from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";
import { tokenStore } from "@/api/auth.service";

// Core CSS
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
// All plugins bundled
import "froala-editor/js/plugins.pkgd.min.js";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = "Write your blog post content here…",
  minHeight = 520,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FroalaEditor = FroalaEditorComponent as any;

  // Fetch Froala license key from the backend (keeps it out of the JS bundle)
  const [froalaKey, setFroalaKey] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/blog/admin/editor-key`, {
      headers: { Authorization: `Bearer ${tokenStore.getAccess() ?? ""}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.key) setFroalaKey(d.key); })
      .catch(() => {});
  }, []);

  // Track resolved dark mode — check html AND any .dark ancestor (AdminLayout)
  const hasDark = () =>
    document.documentElement.classList.contains("dark") ||
    !!document.querySelector(".dark");

  const [isDark, setIsDark] = useState(hasDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(hasDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      subtree: true,
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const config = useMemo(
    () => ({
      key: froalaKey,
      attribution: false,
      height: minHeight,
      placeholderText: placeholder,

      // ── Counters & behaviour ───────────────────────────────────────────────
      charCounterCount: true,
      wordCounterCount: true,
      tabSpaces: 4,
      enter: 1, // FroalaEditor.ENTER_P
      multiLine: true,
      spellcheck: true,
      toolbarSticky: true,
      toolbarStickyOffset: 64,

      // ── Toolbar groups ────────────────────────────────────────────────────
      toolbarButtons: {
        moreText: {
          buttons: [
            "bold", "italic", "underline", "strikeThrough",
            "subscript", "superscript",
            "fontFamily", "fontSize",
            "textColor", "backgroundColor",
            "inlineClass", "inlineStyle",
            "clearFormatting",
          ],
          align: "left",
          buttonsVisible: 10,
        },
        moreParagraph: {
          buttons: [
            "paragraphFormat",
            "alignLeft", "alignCenter", "alignRight", "alignJustify",
            "formatOLSimple", "formatOL", "formatUL",
            "paragraphStyle",
            "lineHeight", "outdent", "indent", "quote",
          ],
          align: "left",
          buttonsVisible: 9,
        },
        moreRich: {
          buttons: [
            "insertLink",
            "insertImage", "insertVideo", "insertFile",
            "insertTable",
            "emoticons", "specialCharacters",
            "insertHR", "embedly",
          ],
          align: "left",
          buttonsVisible: 7,
        },
        moreMisc: {
          buttons: [
            "undo", "redo",
            "fullscreen",
            "selectAll",
            "html",
            "print",
            "spellChecker",
            "help",
          ],
          align: "right",
          buttonsVisible: 4,
        },
      },

      // ── Paragraph / heading formats ────────────────────────────────────────
      paragraphFormat: {
        N:   "Normal",
        H1:  "Heading 1",
        H2:  "Heading 2",
        H3:  "Heading 3",
        H4:  "Heading 4",
        H5:  "Heading 5",
        H6:  "Heading 6",
        PRE: "Code Block",
      },
      paragraphFormatSelection: true,

      // ── Font families ──────────────────────────────────────────────────────
      fontFamily: {
        "Arial,Helvetica,sans-serif":                  "Arial",
        "Georgia,serif":                               "Georgia",
        "'Times New Roman',Times,serif":               "Times New Roman",
        "Courier New,Courier,monospace":               "Courier New",
        "Trebuchet MS,Helvetica,sans-serif":           "Trebuchet",
        "'Segoe UI',Tahoma,Geneva,Verdana,sans-serif": "Segoe UI",
        "Verdana,Geneva,sans-serif":                   "Verdana",
        "Impact,Charcoal,sans-serif":                  "Impact",
        "'Afacad Flux',sans-serif":                    "Afacad Flux",
      },
      fontFamilySelection: true,

      // ── Font sizes ─────────────────────────────────────────────────────────
      fontSize: ["8","10","11","12","13","14","16","18","20","22","24","28","32","36","48","60","72","96"],
      fontSizeSelection: true,
      fontSizeUnit: "px",

      // ── Color palette (9-column grid) ──────────────────────────────────────
      colors: [
        "#000000","#111827","#1F2937","#374151","#6B7280","#9CA3AF","#D1D5DB","#F3F4F6","#FFFFFF",
        "#0096FF","#3B82F6","#2563EB","#1D4ED8","#60A5FA","#93C5FD","#BFDBFE","#DBEAFE","REMOVE",
        "#22C55E","#10B981","#059669","#047857","#34D399","#6EE7B7","#A7F3D0","#D1FAE5","REMOVE",
        "#F59E0B","#D97706","#B45309","#92400E","#FCD34D","#FDE68A","#FEF3C7","#FFFBEB","REMOVE",
        "#EF4444","#DC2626","#B91C1C","#991B1B","#FCA5A5","#FECACA","#FEE2E2","#FFF1F2","REMOVE",
        "#A855F7","#9333EA","#7C3AED","#6D28D9","#C4B5FD","#DDD6FE","#EDE9FE","#F5F3FF","REMOVE",
        "#EC4899","#DB2777","#BE185D","#9D174D","#F9A8D4","#FBCFE8","#FCE7F3","#FDF2F8","REMOVE",
        "#14B8A6","#0D9488","#0F766E","#115E59","#5EEAD4","#99F6E4","#CCFBF1","#F0FDFA","REMOVE",
        "#6366F1","#4F46E5","#4338CA","#3730A3","#A5B4FC","#C7D2FE","#E0E7FF","#EEF2FF","REMOVE",
      ],
      colorsBackground: [
        "#000000","#111827","#1F2937","#374151","#6B7280","#9CA3AF","#D1D5DB","#F3F4F6","#FFFFFF",
        "#0096FF","#3B82F6","#2563EB","#1D4ED8","#60A5FA","#93C5FD","#BFDBFE","#DBEAFE","REMOVE",
        "#22C55E","#10B981","#059669","#047857","#34D399","#6EE7B7","#A7F3D0","#D1FAE5","REMOVE",
        "#F59E0B","#D97706","#B45309","#92400E","#FCD34D","#FDE68A","#FEF3C7","#FFFBEB","REMOVE",
        "#EF4444","#DC2626","#B91C1C","#991B1B","#FCA5A5","#FECACA","#FEE2E2","#FFF1F2","REMOVE",
        "#A855F7","#9333EA","#7C3AED","#6D28D9","#C4B5FD","#DDD6FE","#EDE9FE","#F5F3FF","REMOVE",
      ],
      colorsStep: 9,
      colorsHEXInput: true,

      // ── Paragraph styles ───────────────────────────────────────────────────
      paragraphStyles: {
        "fr-text-gray":         "Gray Text",
        "fr-text-bordered":     "Bordered",
        "fr-text-spaced":       "Spaced",
        "fr-text-uppercase":    "Uppercase",
      },

      // ── Inline classes ─────────────────────────────────────────────────────
      inlineClasses: {
        "fr-class-code":        "Inline Code",
        "fr-class-highlighted": "Highlighted",
        "fr-class-transparency":"Transparency",
      },

      // ── Inline styles ──────────────────────────────────────────────────────
      inlineStyles: {
        "Highlight":    "background-color:#FEF9C3;color:#854D0E;padding:0 3px;border-radius:2px;",
        "Code Snippet": "background:#1E293B;color:#93C5FD;font-family:monospace;padding:2px 6px;border-radius:4px;font-size:0.875em;",
        "Pull Quote":   "border-left:3px solid #0096FF;padding-left:1rem;color:#94A3B8;font-style:italic;",
        "Call Out":     "background:#EFF6FF;border:1px solid #BFDBFE;padding:0.75rem 1rem;border-radius:6px;color:#1E40AF;",
        "Warning":      "background:#FFFBEB;border:1px solid #FDE68A;padding:0.75rem 1rem;border-radius:6px;color:#92400E;",
        "Success":      "background:#F0FDF4;border:1px solid #BBF7D0;padding:0.75rem 1rem;border-radius:6px;color:#166534;",
        "Danger":       "background:#FFF1F2;border:1px solid #FECDD3;padding:0.75rem 1rem;border-radius:6px;color:#9F1239;",
      },

      // ── Lists ──────────────────────────────────────────────────────────────
      listAdvancedTypes: true,

      // ── Table ──────────────────────────────────────────────────────────────
      tableStyles: {
        "fr-dashed-borders":  "Dashed Borders",
        "fr-alternate-rows":  "Alternate Rows",
      },
      tableEditButtons: [
        "tableHeader", "tableRemove", "tableRows", "tableColumns", "tableStyle",
        "-",
        "tableCells", "tableCellBackground", "tableCellVerticalAlign",
        "tableCellHorizontalAlign", "tableCellStyle",
      ],
      tableInsertButtons: ["tableBack", "|"],
      tableResizerOffset: 10,
      tableResizingLimit: 40,

      // ── Image ──────────────────────────────────────────────────────────────
      imageUploadURL: `${API_URL}/blog/admin/cover`,
      imageUploadParam: "cover",
      imageUploadMethod: "POST",
      imageMaxSize: 5 * 1024 * 1024,
      imageAllowedTypes: ["jpeg", "jpg", "png", "gif", "webp", "avif"],
      imageUploadResponseField: "link", // backend returns { link, url, publicId }
      imageDefaultWidth: 0,            // 0 = no forced width, respects CSS
      imageDefaultDisplay: "block",
      imageDefaultAlign: "center",
      imageEditButtons: [
        "imageReplace", "imageAlign", "imageCaption", "imageRemove",
        "|",
        "imageLink", "linkOpen", "linkEdit", "linkRemove",
        "-",
        "imageDisplay", "imageStyle", "imageAlt", "imageSize",
      ],
      imageInsertButtons: ["imageBack", "|", "imageUpload", "imageByURL"],
      imagePasteProcess: true,
      imageResize: true,
      imageOutputSize: true,

      // ── Video ──────────────────────────────────────────────────────────────
      videoUploadURL: `${API_URL}/blog/admin/cover`,
      videoUploadParam: "cover",
      videoUploadMethod: "POST",
      videoMaxSize: 50 * 1024 * 1024,
      videoAllowedTypes: ["mp4", "webm", "ogg"],
      videoUploadResponseField: "link",
      videoDefaultWidth: "100%",
      videoDefaultDisplay: "block",
      videoDefaultAlign: "center",
      videoEditButtons: [
        "videoReplace", "videoRemove",
        "|",
        "videoDisplay", "videoAlign", "videoSize",
      ],
      videoInsertButtons: ["videoBack", "|", "videoByURL", "videoEmbed", "videoUpload"],
      videoResize: true,

      // ── File upload ────────────────────────────────────────────────────────
      fileUploadURL: `${API_URL}/blog/admin/cover`,
      fileUploadParam: "cover",
      fileUploadMethod: "POST",
      fileMaxSize: 20 * 1024 * 1024,
      fileUploadResponseField: "link",
      fileAllowedTypes: ["*"],

      // ── Links ──────────────────────────────────────────────────────────────
      linkInsertButtons: ["linkBack"],
      linkEditButtons: ["linkOpen", "linkEdit", "linkRemove"],
      linkAttributes: { target: "Target", rel: "Rel" },
      linkAlwaysBlank: false,
      linkAlwaysNoFollow: false,

      // ── Quick insert ───────────────────────────────────────────────────────
      quickInsertButtons: ["image", "video", "table", "ul", "ol", "hr"],
      quickInsertEnabled: true,

      // ── Code beautifier ────────────────────────────────────────────────────
      codeBeautifierOptions: {
        end_with_newline: true,
        indent_inner_html: true,
        brace_style: "collapse",
        indent_char: " ",
        indent_size: 2,
        wrap_line_length: 80,
      },

      // ── Events ────────────────────────────────────────────────────────────
      events: {
        // Inject fresh auth token before every upload (images, videos, files)
        "image.beforeUpload": function (
          this: { opts: { requestHeaders: Record<string, string> } }
        ) {
          this.opts.requestHeaders = {
            Authorization: `Bearer ${tokenStore.getAccess() ?? ""}`,
          };
          return true;
        },
        "video.beforeUpload": function (
          this: { opts: { requestHeaders: Record<string, string> } }
        ) {
          this.opts.requestHeaders = {
            Authorization: `Bearer ${tokenStore.getAccess() ?? ""}`,
          };
          return true;
        },
        "file.beforeUpload": function (
          this: { opts: { requestHeaders: Record<string, string> } }
        ) {
          this.opts.requestHeaders = {
            Authorization: `Bearer ${tokenStore.getAccess() ?? ""}`,
          };
          return true;
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [froalaKey, isDark, minHeight, placeholder]
  );

  return (
    <div className="rich-editor-wrapper">
      <FroalaEditor
        key={isDark ? "dark" : "light"}
        tag="textarea"
        model={value}
        onModelChange={onChange}
        config={config}
      />
    </div>
  );
}
