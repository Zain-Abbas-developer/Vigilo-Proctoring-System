
export const exportReport = (range) => {
  const doc = new jsPDF();

  const rangeLabel =
    range === 7
      ? 'Last 7 Days'
      : range === 15
      ? 'Last 15 Days'
      : 'Last 30 Days';

  const today = new Date().toLocaleDateString();

  // =========================
  // HEADER
  // =========================

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Analytics & Reports', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Exam performance and student activity report`,
    14,
    27
  );

  doc.text(`Date Range: ${rangeLabel}`, 14, 34);
  doc.text(`Generated: ${today}`, 14, 40);

  // =========================
  // OVERVIEW STATS
  // =========================

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Overview Statistics', 14, 52);

  autoTable(doc, {
    startY: 57,
    head: [['Metric', 'Value', 'Change']],
    body: [
      ['Average Score', '82.4%', '+5.8% from last month'],
      ['Pass Rate', '87.6%', '+3.2% from last month'],
      ['Active Students', '486', '+8.2% from last month'],
      ['Average Risk', '28.6%', '-4.1% from last month'],
    ],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fontStyle: 'bold',
    },
  });

  // =========================
  // PERFORMANCE OVERVIEW
  // =========================

  let currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Overview', 14, currentY);

  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Score Range', 'Percentage', 'Students']],
    body: [
      ['90 - 100%', '32%', '155'],
      ['80 - 89%', '28%', '136'],
      ['70 - 79%', '21%', '102'],
      ['60 - 69%', '12%', '58'],
      ['Below 60%', '7%', '35'],
    ],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fontStyle: 'bold',
    },
  });

  // =========================
  // EXAM SUMMARY
  // =========================

  currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Exam Summary', 14, currentY);

  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Activity', 'Count']],
    body: [
      ['Total Exams', '24'],
      ['Total Attempts', '1,284'],
      ['Passed', '1,125'],
      ['Flagged', '86'],
    ],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fontStyle: 'bold',
    },
  });

  // =========================
  // EXAM PERFORMANCE
  // =========================

  currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Exam Performance', 14, currentY);

  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Exam', 'Attempts', 'Average', 'Pass Rate', 'Risk']],
    body: examPerformance.map((exam) => [
      exam.exam,
      exam.attempts,
      `${exam.average}%`,
      `${exam.passRate}%`,
      `${exam.risk}%`,
    ]),
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
    },
  });

  // =========================
  // TOP STUDENTS
  // =========================

  currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Top Performing Students', 14, currentY);

  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Rank', 'Student', 'Exams Completed', 'Average', 'Risk']],
    body: topStudents.map((student, index) => [
      `#${index + 1}`,
      student.name,
      student.exams,
      `${student.average}%`,
      `${student.risk}%`,
    ]),
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fontStyle: 'bold',
    },
  });

  // =========================
  // FOOTER ON EVERY PAGE
  // =========================

  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    doc.text(
      `Analytics & Reports | ${rangeLabel}`,
      14,
      doc.internal.pageSize.height - 10
    );

    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }

  // =========================
  // DOWNLOAD PDF
  // =========================

  doc.save(
    `analytics-report-${rangeLabel
      .toLowerCase()
      .replace(/\s+/g, '-')}.pdf`
  );
};
