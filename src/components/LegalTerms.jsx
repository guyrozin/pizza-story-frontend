import React from 'react';
import { useNavigate } from 'react-router-dom';

const RED  = '#E31837';
const DARK = '#1A1A1A';

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-3" style={{ border: '1px solid #f0f0f0' }}>
      <h2 className="font-black text-base" style={{ color: RED }}>{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function LegalTerms() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-screen" style={{ background: '#f5f5f5' }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center relative">
        <button type="button" onClick={() => navigate(-1)} className="absolute right-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke={DARK} strokeWidth="1.8" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="flex-1 text-center">
          <span className="font-black text-xl tracking-widest" style={{ color: DARK }}>PIZZA STORY</span>
        </div>
      </div>

      <div className="px-4 pt-4 pb-24 space-y-4">
        <h1 className="font-black text-2xl text-center" style={{ color: DARK }}>תקנון האתר</h1>
        <p className="text-xs text-gray-400 text-center">עודכן לאחרונה: מרץ 2026</p>

        {/* ── 1. מדיניות אחריות ── */}
        <Section title="1. מדיניות אחריות">
          <p>
            Pizza Story מתחייבת לספק מוצרי מזון איכותיים ותקינים. במידה והמוצר שהתקבל פגום,
            שגוי או אינו תואם להזמנה — יש לפנות אלינו בתוך שעה מקבלת ההזמנה.
          </p>
          <p>
            אחריותנו מוגבלת לערך ההזמנה בלבד. איננו אחראים לנזקים עקיפים כלשהם.
            מוצרים הכוללים אלרגנים מסומנים בתפריט; האחריות לבדיקת הרכב המוצר לפני
            ההזמנה חלה על הלקוח.
          </p>
          <p>
            הפיצות מוכנות טרייה בעת ההזמנה. איכות המוצר עלולה להיפגע אם לא נצרך
            מיד עם הגעתו.
          </p>
        </Section>

        {/* ── 2. מדיניות משלוחים וזמני אספקה ── */}
        <Section title="2. מדיניות משלוחים וזמני אספקה">
          <p>
            <strong>זמן אספקה:</strong> זמן המשלוח הממוצע הוא עד <strong>90 דקות</strong> מרגע אישור ההזמנה,
            בהתאם לעומס ולמרחק.
          </p>
          <p>
            <strong>אזור משלוח:</strong> המשלוחים מתבצעים לאזורי פעילות המסעדה בלבד.
            ניתן לברר את אזור המשלוח בפנייה לשירות הלקוחות במספר <strong>3606*</strong>.
          </p>
          <p>
            <strong>דמי משלוח:</strong> דמי המשלוח נקבעים לפי מרחק מהסניף. הזמנות איסוף עצמי פטורות מדמי משלוח.
          </p>
          <p>
            <strong>עיכובים:</strong> Pizza Story אינה אחראית לעיכובים הנובעים מתנאי מזג אוויר,
            פקקים או גורמים שאינם בשליטתנו. במקרה של עיכוב חריג נעדכן את הלקוח.
          </p>
          <p>
            <strong>אי-מסירה:</strong> במידה והשליח לא הצליח להגיע לכתובת שסופקה, ייצור קשר עם הלקוח.
            לאחר שתי ניסיונות התקשרות ללא מענה, ההזמנה תוחזר למסעדה.
          </p>
        </Section>

        {/* ── 3. מדיניות ביטולים ── */}
        <Section title="3. מדיניות ביטולים">
          <p>
            <strong>ביטול לפני הכנה:</strong> ניתן לבטל הזמנה ללא חיוב בתוך <strong>5 דקות</strong> מרגע ביצוע ההזמנה,
            בתנאי שהכנת המזון טרם החלה. לביטול יש לפנות לשירות הלקוחות במספר <strong>3606*</strong>.
          </p>
          <p>
            <strong>ביטול לאחר תחילת הכנה:</strong> לאחר שהכנת ההזמנה החלה, לא ניתן לבטל
            ולא יינתן החזר כספי.
          </p>
          <p>
            <strong>ביטול עקב תקלה:</strong> אם ההזמנה בוטלה מצד המסעדה (מחסור במצרכים, תקלה טכנית וכו'),
            הלקוח יקבל החזר מלא תוך 3–5 ימי עסקים.
          </p>
          <p>
            <strong>הזמנה שגויה:</strong> אם הייתה טעות, נפצה אתכם לפי גודל הטעות בכל ההזמנה או בחלקה.
          </p>
        </Section>

        {/* ── 4. מדיניות פרטיות ── */}
        <Section title="4. מדיניות פרטיות">
          <p>
            Pizza Story מכבדת את פרטיות לקוחותיה ומחויבת לשמור על המידע האישי שנמסר לנו.
          </p>
          <p>
            <strong>המידע שנאסף:</strong> שם, מספר טלפון, כתובת למשלוח והעדפות הזמנה.
            המידע משמש אך ורק לצורך עיבוד ההזמנה ושיפור השירות.
          </p>
          <p>
            <strong>אבטחת מידע פיננסי:</strong> אנו מתחייבים לא להעביר את פרטי האשראי של הלקוח לצד ג'.
            עסקאות האשראי מבוצעות דרך מערכת סליקה מאובטחת ומוצפנת בתקן PCI-DSS.
          </p>
          <p>
            <strong>שיתוף מידע:</strong> לא נמכור, לא נשכיר ולא נעביר את פרטיך האישיים לצדדים שלישיים,
            למעט שליח חיצוני לצורך ביצוע המשלוח בלבד.
          </p>
          <p>
            <strong>עוגיות (Cookies):</strong> האתר משתמש בעוגיות לשיפור חוויית המשתמש ושמירת תכולת העגלה.
            ניתן לכבות עוגיות בהגדרות הדפדפן.
          </p>
          <p>
            <strong>זכות עיון ומחיקה:</strong> בהתאם לחוק הגנת הפרטיות, תשמ"א–1981,
            הלקוח רשאי לבקש עיון במידע הנשמר עליו ומחיקתו בכל עת, באמצעות פנייה לשירות הלקוחות במספר <strong>3606*</strong>.
          </p>
        </Section>

        <p className="text-xs text-gray-400 text-center pb-2">
          לשאלות ובירורים: 3606* · התמר 5, יוקנעם
        </p>
      </div>
    </div>
  );
}
