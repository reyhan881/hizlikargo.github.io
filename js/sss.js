document.addEventListener('DOMContentLoaded', () => {

    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            
            // İkonu ve soruyu aktif/pasif yap
            question.classList.toggle('active');

            // Cevap panelini aç/kapat
            if (answer.style.maxHeight) {
                // Panel açıksa, kapat
                answer.style.maxHeight = null;
                answer.style.padding = "0 10px"; // Kapanırken padding'i sıfırla
            } else {
                // Panel kapalıysa, aç
                // padding'i açılmadan önce ayarla ki animasyon düzgün olsun
                answer.style.padding = "0 10px 20px 10px";
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});