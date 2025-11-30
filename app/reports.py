from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime

def generate_pdf_report(data: dict) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Custom Styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#2c3e50')
    )
    
    h1_style = ParagraphStyle(
        'CustomH1',
        parent=styles['Heading1'],
        fontSize=18,
        spaceBefore=20,
        spaceAfter=10,
        textColor=colors.HexColor('#34495e')
    )

    h2_style = ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontSize=14,
        spaceBefore=15,
        spaceAfter=10,
        textColor=colors.HexColor('#7f8c8d')
    )

    body_style = styles['BodyText']
    body_style.fontSize = 11
    body_style.leading = 14

    # Title Page
    story.append(Paragraph("The Council AI", title_style))
    story.append(Paragraph("Strategic Board Decision Report", h1_style))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"Date: {datetime.now().strftime('%B %d, %Y')}", body_style))
    story.append(Spacer(1, 30))

    # Executive Summary
    story.append(Paragraph("Executive Summary", h1_style))
    story.append(Paragraph(data.get('executive_summary', 'No summary provided.'), body_style))
    story.append(Spacer(1, 20))

    # Strategic Options
    story.append(Paragraph("Strategic Options", h1_style))
    options = data.get('strategic_options', [])
    
    if options:
        for i, opt in enumerate(options, 1):
            opt_title = opt.get('option', f'Option {i}')
            story.append(Paragraph(f"{i}. {opt_title}", h2_style))
            
            # Pros & Cons Table
            pros = opt.get('pros', '')
            cons = opt.get('cons', '')
            
            table_data = [
                [Paragraph('<b>Pros</b>', body_style), Paragraph('<b>Cons</b>', body_style)],
                [Paragraph(pros, body_style), Paragraph(cons, body_style)]
            ]
            
            t = Table(table_data, colWidths=[3*inch, 3*inch])
            t.setStyle(TableStyle([
                ('GRID', (0,0), (-1,-1), 1, colors.grey),
                ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,0), (-1,-1), 6),
            ]))
            story.append(t)
            story.append(Spacer(1, 10))
            
            if opt.get('backing_evidence'):
                story.append(Paragraph(f"<b>Evidence:</b> {opt.get('backing_evidence')}", body_style))
            story.append(Spacer(1, 15))

    # Risks
    story.append(Paragraph("Critical Risks", h1_style))
    risks = data.get('risks_to_address', [])
    for risk in risks:
        story.append(Paragraph(f"• {risk}", body_style))
    story.append(Spacer(1, 20))

    # Final Verdict
    story.append(Paragraph("Final Verdict", h1_style))
    verdict_style = ParagraphStyle(
        'Verdict',
        parent=body_style,
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#27ae60'),
        borderPadding=10,
        borderColor=colors.HexColor('#27ae60'),
        borderWidth=1,
        backColor=colors.HexColor('#ecf9f1')
    )
    story.append(Paragraph(data.get('final_verdict', 'No verdict provided.'), verdict_style))

    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer
