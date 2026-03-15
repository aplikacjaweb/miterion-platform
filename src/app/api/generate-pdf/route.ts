import React from 'react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('API generate-pdf: Request received.');

    let body: unknown = null;

    try {
      body = await request.json();
      console.log('API generate-pdf: Request body parsed.', body);
    } catch (parseError) {
      console.log('API generate-pdf: No JSON body or parsing failed.', parseError);
    }

    console.log('API generate-pdf: Importing @react-pdf/renderer...');
    const { pdf, Document, Page, Text } = await import('@react-pdf/renderer');
    console.log('API generate-pdf: @react-pdf/renderer imported successfully.');

    const doc = React.createElement(
      Document,
      null,
      React.createElement(
        Page,
        { size: 'A4' },
        React.createElement(Text, null, 'Test PDF Generated Successfully!')
      )
    );

    console.log('API generate-pdf: PDF document object created.');

    const pdfInstance = pdf(doc);
    console.log('API generate-pdf: pdf() instance created.');

    const buffer = await pdfInstance.toBuffer();
    console.log('API generate-pdf: PDF buffer generated successfully.');

    return new Response(buffer as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test.pdf"',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);

    return Response.json(
      {
        error: 'PDF generation failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}